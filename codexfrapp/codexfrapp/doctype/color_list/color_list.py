# Copyright (c) 2025, Aaran Software and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class ColorList(Document):
	def validate(self):

		#auto-filling of color code while user write a color name
		if not self.color_code:
			self.color_code = self.color_name

	def before_save(self):
		#for a new doc validation
		if self.is_new:
			self.color_name = self.color_code


		 
#for updating or editing the existing doc
@frappe.whitelist()
def rename_color_list(docname, new_name):
    if docname != new_name:
        # Rename the document
        renamed = frappe.rename_doc("Color List", docname, new_name, force=True)

        # Load the renamed document
        new_doc = frappe.get_doc("Color List", renamed)

        # Update the color_code to match the new name
        new_doc.color_code = new_name
        new_doc.save()

        return renamed


