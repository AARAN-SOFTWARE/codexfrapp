# Copyright (c) 2025, Aaran Software and contributors
# For license information, please see license.txt

# import frappe
import frappe
from frappe.core.doctype.user.user import now_datetime
from frappe.model.document import Document
from datetime import datetime

class SerialandBarcode(Document):
  def before_insert(self):
        self.generate_serial_numbers()

  def generate_serial_numbers(self):
        if not self.qty:
            return

        timestamp_prefix = now_datetime().strftime("%y%m%d%H")  # YYMMDDHH
        existing_serials = frappe.get_all("Serial Detail",
            filters={"serial_no": ["like", f"{timestamp_prefix}%"]},
            pluck="serial_no"
        )

        existing_suffixes = [
            int(serial[-4:]) for serial in existing_serials if serial[-4:].isdigit()
        ] if existing_serials else []

        next_suffix = 1 if not existing_suffixes else max(existing_suffixes) + 1

        self.serial_no = []
        for i in range(self.qty):
            suffix = next_suffix + i

            if suffix > 9999:
                suffix = (suffix - 1) % 9999 + 1  # roll back to 0001 after 9999

            serial_number = f"{timestamp_prefix}{str(suffix).zfill(4)}"

            self.append("serial_no", {
                "serial_no": serial_number
            })

 

	
