// Copyright (c) 2025, Aaran Software and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Barcode Generator", {
// 	refresh(frm) {
//     const barcode_value = frm.doc.barcode?.trim();

//     console.log("Generated Barcode:", barcode_value);

//     if (barcode_value && frm.fields_dict.barcode_preview?.$wrapper) {
//         frm.fields_dict.barcode_preview.$wrapper.html(`
//             <svg id="barcode"></svg>
//         `);
//         JsBarcode("#barcode", barcode_value, {
//             format: "CODE128",
//             lineColor: "#000",
//             width: 2,
//             height: 50,
//             displayValue: true
//         });
//     } else {
//         frm.fields_dict.barcode_preview?.$wrapper?.empty();
//     }
// }
// });

frappe.ui.form.on("Barcode Generator", {
    refresh(frm) {
        frm._serials_loaded = false;  // reset flag on refresh
        if (frm.doc.purchase_receipt_ref && !frm._serials_loaded) {
            fetch_serials(frm);
        }
    },

    purchase_receipt_ref(frm) {
        if (!frm._serials_loaded) {
            fetch_serials(frm);
        }
    }
});

function fetch_serials(frm) {
    if (frm.doc.purchase_receipt_ref) {
        console.log("🔄 Fetching serials for:", frm.doc.purchase_receipt_ref);
        frappe.call({
            method: "codexfrapp.codexfrapp.doctype.barcode_generator.barcode_generator.get_serial_nos",
            args: {
                purchase_receipt: frm.doc.purchase_receipt_ref
            },
            callback: function(r) {
                frm._serials_loaded = true;  // ✅ Prevent repeat calls
                if (r.message && r.message.length > 0) {
                    const serials = r.message.join(",");
                    frm.set_value("serial_no", serials);
                    console.log("✅ Serial numbers loaded:", serials);
                } else {
                    frm.set_value("serial_no", "");
                    frappe.msgprint("❗ No serial numbers found for this Purchase Receipt.");
                }
            }
        });
    }
}


