from flask import Flask, request, render_template, send_file
from docx import Document
import os

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("form.html")


@app.route("/generate", methods=["POST"])
def generate_docx():
    # Collect form data
    data = {
        "output": request.form["output"],
        "vulnerability_title": request.form["title"],
        "severity": request.form["severity"],
        "status": request.form["status"],
        "cvss_score": request.form["cvss_score"],
        "cwe_id": request.form["cwe_id"],
        "owasp_category": request.form["owasp_category"],
        "description": request.form["description"],
        "impact": request.form["impact"],
        "affected_url": request.form["affected_url"],
        "reference_url": request.form["reference_url"],
        "recommendations": request.form["recommendations"],
        "steps": request.form["steps"],
    }

    # Load the template and populate it
    template_path = "./template.docx"
    doc = Document(template_path)

    # Example for populating fields
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                for key, value in data.items():
                    if key.lower() in cell.text:
                        cell.text = cell.text.replace(key.lower(), value)
                        cell.text = cell.text.replace(
                            "vulnerability_title", data["vulnerability_title"]
                        )

    # Save the updated document
    output_path = data["output"] + ".docx"
    doc.save(output_path)

    return send_file(output_path, as_attachment=True)


if __name__ == "__main__":
    app.run(debug=True)
