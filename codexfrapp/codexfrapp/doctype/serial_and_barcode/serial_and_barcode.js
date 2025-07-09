// Copyright (c) 2025, Aaran Software and contributors
// For license information, please see license.txt

 
frappe.ui.form.on('Serial and Barcode', {
	before_print(frm) {
		// Clear both fields just before printing
		frm.set_value('missing_no', '');
		frm.set_value('missing_range', '');
	},

	item_code(frm) {
		if (frm.doc.item_code) {
			frappe.db.get_value('Item', frm.doc.item_code, 'item_name')
				.then(r => {
					if (r.message && r.message.item_name) {
						frm.set_value('item_name', r.message.item_name);
					}
				});
		}

		// Rebuild local serial list
		frm.serial_list = [];
		if (frm.doc.serial_no?.length) {
			frm.doc.serial_no.forEach(row => {
				if (row.serial_no) frm.serial_list.push(row.serial_no);
			});
		}
	},

	
});
