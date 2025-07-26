# Copyright (c) 2025, Aaran Software and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document
from frappe.utils import flt, nowdate
from frappe import throw, _
import frappe

class SalesEntry(Document):
    

    def before_insert(self):
    #     # Set default status
    #     if not self.status:
    #         self.status = "Draft"
      
    # Assign invoice number and name just before inserting
        next_no = get_next_invoice_no()
        self.invoice_no = next_no  # No need to convert to string
        self.name = str(next_no)  # Name must still be string
    
    def validate(self):
        
        #for access the sales_type in the child table logic
        for item in self.sales_item:
            item.sales_type_copy = self.sales_type
         
      

        self.grand_total = 0

        for row in self.get("sales_item"):
            if not row.product:
                throw(_("Row #{0}: Product is required").format(row.idx))

            row.taxable = flt(row.qty) * flt(row.price)
            row.gst = (row.taxable * flt(row.gst_percent)) / 100
            row.subtotal = row.taxable + row.gst

            self.grand_total += row.subtotal




def get_next_invoice_no():
    result = frappe.db.sql("""
        SELECT MAX(invoice_no) AS max_no
        FROM `tabSales Entry`
    """, as_dict=True)
    
    if result and result[0].max_no:
        return result[0].max_no + 1
    return 1



