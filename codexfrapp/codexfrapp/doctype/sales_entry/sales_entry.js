// Copyright (c) 2025, Aaran Software and contributors
// For license information, please see license.txt

frappe.ui.form.on("Sales Entry", {
    refresh: function (frm) {
        // Optional: Change default "Add Row" button color to green
        $('[data-fieldname="sales_item"] .grid-add-row').addClass("btn-success");
    },

    sales_item_add(frm) {
        update_totals(frm);
    },

    sales_item_remove(frm) {
        update_totals(frm);
    },

    before_save: function (frm) {
        update_totals(frm);
    }

    // sales_item_add(frm) {
    //     setTimeout(() => update_totals(frm), 20);
    // },

    // sales_item_remove(frm) {
    //     setTimeout(() => update_totals(frm), 20);
    // },

    // onload: function (frm) {
    //     // This will track deletion even when user uses bulk checkbox delete
    //     frm.fields_dict.sales_item.grid.wrapper.on("click", ".grid-delete-row", function () {
    //         setTimeout(() => update_totals(frm), 100); // slight delay for DOM update
    //     });

    //     // Also works for multi-row delete via checkbox + "Delete"
    //     frm.fields_dict.sales_item.grid.wrapper.on("click", ".grid-remove-rows", function () {
    //         setTimeout(() => update_totals(frm), 100);
    //     });
    // }
});


// FIELD EVENT: CHILD TABLE - Sales Item Details
frappe.ui.form.on("Sales Item Details", {
    product(frm, cdt, cdn) {
        fetch_gst_percent(frm, cdt, cdn);
    },
    qty(frm, cdt, cdn) {
        calculate_row(frm, cdt, cdn);
    },
    price(frm, cdt, cdn) {
        calculate_row(frm, cdt, cdn);
    },
    gst_percent(frm, cdt, cdn) {
        calculate_row(frm, cdt, cdn);
    },

    color_code: function(frm){
        if(!frm.doc.color_name) frm.ser_value("color_name", frm.doc.color_code);
    }
});

// Get GST % from Product Details Doctype
function fetch_gst_percent(frm, cdt, cdn) {
    let row = locals[cdt][cdn];
    if (!row.product) return;

    frappe.call({
        method: "frappe.client.get_value",
        args: {
            doctype: "Product Details",
            filters: { name: row.product },
            fieldname: ["gst_percent"]
        },
        callback(r) {
            if (!r.exc && r.message) {
                frappe.model.set_value(cdt, cdn, {
                    gst_percent: r.message.gst_percent || 0
                });
                calculate_row(frm, cdt, cdn);
            }
        }
    });
}

// Per-row calculation for GST, Taxable, Subtotal
function calculate_row(frm, cdt, cdn) {
    let row = locals[cdt][cdn];
    row.taxable = flt(row.qty) * flt(row.price);
    row.gst = (row.taxable * flt(row.gst_percent)) / 100;
    row.subtotal = row.taxable + row.gst;

    frappe.model.set_value(cdt, cdn, "taxable", row.taxable);
    frappe.model.set_value(cdt, cdn, "gst", row.gst);
    frappe.model.set_value(cdt, cdn, "subtotal", row.subtotal);

    update_totals(frm);
}

// Global totals calculation
function update_totals(frm) {
    let totals = (frm.doc.sales_item || []).reduce((acc, row) => ({
        qty: acc.qty + (flt(row.qty) || 0),
        taxable: acc.taxable + (flt(row.taxable) || 0),
        gst: acc.gst + (flt(row.gst) || 0),
        subtotal: acc.subtotal + (flt(row.subtotal) || 0)
    }), { qty: 0, taxable: 0, gst: 0, subtotal: 0 });

    frm.set_value("total_qty", totals.qty);
    frm.set_value("total_taxable", totals.taxable);
    frm.set_value("total_gst", totals.gst);
    frm.set_value("grand_total", totals.subtotal);

    frm.refresh_field("total_qty");
    frm.refresh_field("total_taxable");
    frm.refresh_field("total_gst");
    frm.refresh_field("grand_total");
}
