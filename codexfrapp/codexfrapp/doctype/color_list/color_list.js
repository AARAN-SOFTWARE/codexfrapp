// Copyright (c) 2025, Aaran Software and contributors
// For license information, please see license.txt

frappe.ui.form.on("Color List", {
	refresh(frm) {
      
	},


  color_code(frm) {
    if (frm.doc.color_code && frm.doc.color_code !== frm.doc.name) {
      frappe.call({
        method: "codexfrapp.codexfrapp.doctype.color_list.color_list.rename_color_list",
        args: {
          docname: frm.doc.name,
          new_name: frm.doc.color_code
        },
        callback: function(r) {
          if (!r.exc) {
            frappe.msgprint("Document renamed to " + r.message);
            // Reload the form with new name
            frappe.set_route("Form", "Color List", r.message);
          }
        }
      });
    }
  }
  


    
});
