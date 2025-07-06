# Copyright (c) 2025, Aaran Software and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document
import frappe
import random
import string
from frappe.website.website_generator import WebsiteGenerator
from frappe import _
from datetime import datetime


class BarcodeGenerator(WebsiteGenerator):
	pass

def generate_structured_barcode():
    today_str = datetime.now().strftime("%y%m%d")  # YYMMDD
    batch = 1
    serial = 1

    while True:
        # Format batch like B1, B2...
        batch_str = f"B{batch}"
        serial_str = f"{serial:04d}"  # pad serial to 4 digits
        barcode = f"{today_str}{batch_str}{serial_str}"

        # Check if barcode already exists
        if not frappe.db.exists('Stock Product', {'barcode': barcode}):
            return barcode

        # If it exists, increment serial or batch
        serial += 1
        if serial > 9999:
            serial = 1
            batch += 1

def before_insert(doc, method):
    if not doc.barcode:
        doc.barcode = generate_structured_barcode()
