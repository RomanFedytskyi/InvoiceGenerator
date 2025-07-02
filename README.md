# Invoice PDF Generator
![screencapture-localhost-5173-2025-07-02-12_10_06](https://github.com/user-attachments/assets/7120a8c8-4419-4668-b3ef-24f87c4775f7)

A simple invoice generation tool built with **React**, **Formik**, **Mantine UI**, and **@react-pdf/renderer**. It allows users to configure invoice details and generate live PDF previews with downloadable output.

---

## Features

- Form builder with sections for sender, recipient, line items, and payment info
- Live PDF preview with selectable style templates
- Downloadable invoice as a PDF
- Auto-saving to localStorage
- ⚙️ Multiple visual styles (10+)
- 📁 File-based style modularization for maintainability

---

## Technologies

- React
- Formik
- Yup
- Mantine UI
- @react-pdf/renderer

---

## Getting Started

```bash
# Install dependencies
bun install
# or
npm install

# Start development
bun dev
# or
npm run dev
```

---

## TODO

- 🧾 Add invoice item category or tags
- 🖼️ Support uploading and positioning a company logo
- ✍️ Allow drawing or uploading a digital signature
- 📤 Email invoice directly from the app
- 🌐 Internationalization (i18n) support
- 💵 Add currency/language selection
- 📅 Date format customization
- 🧩 Add QR code with payment details
- 📊 Basic analytics (e.g., number of invoices created)
- 🔐 Optional authentication for saving/exporting invoice history
