# Copyright (c) 2025, Aaran Software and contributors
# For license information, please see license.txt


import frappe
from frappe.model.document import Document

class BarcodeGenerator(Document):
    pass

@frappe.whitelist()
def get_serial_nos(purchase_receipt):
    serial_nos = frappe.get_all(
        "Serial No",
        filters={"purchase_document_no": purchase_receipt},
        fields=["name"],
        order_by="creation asc"
    )
    return [s["name"] for s in serial_nos]


# DEBUGGING----->CODE

# import frappe
# from frappe.model.document import Document

# class BarcodeGenerator(Document):
#     pass

# @frappe.whitelist()
# def get_serial_nos(purchase_receipt):
#     frappe.logger().info(f"🔍 Fetching Serial Nos for: {purchase_receipt}")
    
#     serial_nos = frappe.get_all(
#         "Serial No",
#         filters={"purchase_document_no": purchase_receipt},
#         fields=["name"],
#         order_by="creation asc"
#     )
    
#     frappe.logger().info(f"✅ Found {len(serial_nos)} serials")

#     return [s["name"] for s in serial_nos]

# def generate_structured_barcode():
#     today_str = datetime.now().strftime("%y%m%d")  # YYMMDD
#     batch = 1
#     serial = 1

#     while True:
#         # Format batch like B1, B2...
#         batch_str = f"B{batch}"
#         serial_str = f"{serial:04d}"  # pad serial to 4 digits
#         barcode = f"{today_str}{batch_str}{serial_str}"

#         # Check if barcode already exists
#         if not frappe.db.exists('Stock Product', {'barcode': barcode}):
#             return barcode

#         # If it exists, increment serial or batch
#         serial += 1
#         if serial > 9999:
#             serial = 1
#             batch += 1

# def before_insert(doc, method):
#     if not doc.barcode:
#         doc.barcode = generate_structured_barcode()
