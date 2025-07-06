// Copyright (c) 2025, Aaran Software and contributors
// For license information, please see license.txt

frappe.ui.form.on("Barcode Generator", {
	refresh(frm) {
    const barcode_value = frm.doc.barcode?.trim();

    console.log("Generated Barcode:", barcode_value);

    if (barcode_value && frm.fields_dict.barcode_preview?.$wrapper) {
        frm.fields_dict.barcode_preview.$wrapper.html(`
            <svg id="barcode"></svg>
        `);
        JsBarcode("#barcode", barcode_value, {
            format: "CODE128",
            lineColor: "#000",
            width: 2,
            height: 50,
            displayValue: true
        });
    } else {
        frm.fields_dict.barcode_preview?.$wrapper?.empty();
    }
}
});
