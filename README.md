# lilbugs

A prototype energy management workspace combining a demo dashboard, document extraction/OCR tools, and energy forecasting models.

## Project Overview

This repository contains three main pieces:

- **Dashboard** (`dashboard/`): a frontend dashboard with mock energy and industrial sensor metrics, plus a Flask API stub for live sensor, prediction, and forecast endpoints.
- **Document extraction model** (`Document extraction model/`): a Python OCR pipeline for extracting energy usage and billing data from PDFs and images.
- **Estimation and prediction model** (`estimation and prediction model/`): a preprocessing/forecasting prototype for energy and emissions predictions from structured data.

## Contents

- `dashboard/index (1).html` — dashboard UI page
- `dashboard/script.js` — dashboard logic, charts, live data simulation, and scenario visualizations
- `dashboard/style.css` — dashboard styling
- `dashboard/API.py` — Flask API skeleton for sensor data, prediction, and forecast endpoints
- `Document extraction model/data_cleaning_nrtf (2).py` — OCR and data extraction pipeline using EasyOCR, OpenCV, and PyMuPDF
- `estimation and prediction model/prediction and estimation model.py` — prototype script for energy forecasting, CO2 estimation, and anomaly-ready output formatting

## Features

- Simulated industrial energy/sensor dashboard with charts, alerts, and recommendations
- Flask API boilerplate for integrating backend model data
- OCR-based data cleaning for energy invoices and meter readings
- Unit normalization and field extraction for multiple energy units
- Time-series forecasting and anomaly-aware output generation from Excel data

## Setup

### Dashboard

1. Install Python dependencies:

```bash
pip install flask flask-cors
```

2. Run the API server from `dashboard`:

```bash
cd dashboard
python API.py
```

3. Open `dashboard/index (1).html` in a browser.

### Document extraction

This notebook-derived script currently uses Colab-style dependencies and assumes input/output directories:

- `INPUT_DIR` set to `/content/input_files`
- `OUTPUT_DIR` set to `/content/output`

Install required packages before running:

```bash
pip install easyocr opencv-python-headless pandas numpy matplotlib openpyxl pymupdf
```

### Estimation and prediction model

Install required packages before running:

```bash
pip install pandas numpy transformers peft accelerate bitsandbytes datasets trl
```

Then run the script from the folder:

```bash
cd "estimation and prediction model"
python "prediction and estimation model.py"
```

## Notes

- This repository is currently a prototype workspace, so file names and model imports are placeholders.
- `dashboard/API.py` expects a `your_model` module; replace it with your own prediction logic or integration layer.
- The document extraction script is optimized for energy-related invoices and meter readings and may need dataset-specific tuning.

## License

This repository is licensed under the terms of the included `LICENSE` file.
