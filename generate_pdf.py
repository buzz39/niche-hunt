#!/usr/bin/env python3
"""Generate the NicheHunt premium PDF deliverable using ReportLab."""
import json
from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer,
    PageBreak, KeepTogether, Flowable
)
from reportlab.graphics.shapes import Drawing, Rect, String
from reportlab.pdfgen.canvas import Canvas

# Colors
NAVY = HexColor('#1a1a2e')
GOLD = HexColor('#f0c040')
LIGHT_GRAY = HexColor('#f0f0f0')
DARK_GRAY = HexColor('#333333')
GREEN = HexColor('#2ecc71')
ORANGE = HexColor('#e67e22')
RED = HexColor('#e74c3c')
WHITE = white
MEDIUM_GRAY = HexColor('#666666')

PAGE_W, PAGE_H = letter

# Load data
with open("niches.json") as f:
    niches = json.load(f)

categories = {}
for n in niches:
    cat = n.get("category", "Other").title()
    categories.setdefault(cat, []).append(n)

def difficulty_color(diff):
    d = diff.lower()
    if 'high' in d: return RED
    if 'medium' in d: return ORANGE
    return GREEN

def parse_cpm_avg(cpm_str):
    """Parse CPM string like '$40-$60' and return average float."""
    try:
        parts = cpm_str.replace('$', '').split('-')
        return sum(float(p) for p in parts) / len(parts)
    except:
        return 0

def header_footer(canvas, doc):
    """Draw header and footer on every page (except cover)."""
    if doc.page == 1:
        return
    canvas.saveState()
    # Header
    canvas.setFillColor(NAVY)
    canvas.setFont('Helvetica-Bold', 9)
    canvas.drawString(54, PAGE_H - 36, "NicheHunt Database 2026")
    canvas.setFont('Helvetica', 9)
    canvas.drawRightString(PAGE_W - 54, PAGE_H - 36, f"Page {doc.page}")
    # Gold line
    canvas.setStrokeColor(GOLD)
    canvas.setLineWidth(1.5)
    canvas.line(54, PAGE_H - 42, PAGE_W - 54, PAGE_H - 42)
    canvas.restoreState()

def build_cover(story):
    """Build cover page elements using a full-page table hack."""
    # We'll draw the cover via a custom flowable approach
    story.append(CoverPage())
    story.append(PageBreak())

class CoverPage(Flowable):
    """Custom flowable for the cover page."""
    def __init__(self):
        Flowable.__init__(self)
        self.width = PAGE_W
        self.height = PAGE_H
    def wrap(self, availWidth, availHeight):
        return (0, 0)
    def drawOn(self, canvas, x, y, _sW=0):
        canvas.saveState()
        # Navy background
        canvas.setFillColor(NAVY)
        canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
        # Gold accent lines
        canvas.setStrokeColor(GOLD)
        canvas.setLineWidth(3)
        canvas.line(72, PAGE_H - 180, PAGE_W - 72, PAGE_H - 180)
        canvas.line(72, 200, PAGE_W - 72, 200)
        # Gold diamond accent
        cx = PAGE_W / 2
        canvas.setFillColor(GOLD)
        canvas.setFont('Helvetica-Bold', 28)
        canvas.drawCentredString(cx, PAGE_H - 140, "◆  ◆  ◆")
        # Title
        canvas.setFillColor(WHITE)
        canvas.setFont('Helvetica-Bold', 36)
        canvas.drawCentredString(cx, PAGE_H - 260, "NicheHunt Database")
        canvas.setFont('Helvetica-Bold', 48)
        canvas.setFillColor(GOLD)
        canvas.drawCentredString(cx, PAGE_H - 320, "2026")
        # Subtitle
        canvas.setFillColor(WHITE)
        canvas.setFont('Helvetica', 16)
        canvas.drawCentredString(cx, PAGE_H - 380, "170 YouTube Niches Analyzed & Ranked")
        # Description
        canvas.setFillColor(HexColor('#aaaaaa'))
        canvas.setFont('Helvetica', 12)
        canvas.drawCentredString(cx, PAGE_H - 420, "CPM Rates · Competition Levels · Growth Trends · Monetization Strategies")
        # Branding
        canvas.setFillColor(GOLD)
        canvas.setFont('Helvetica-Bold', 18)
        canvas.drawCentredString(cx, 140, "nichehunt.xyz")
        canvas.setFillColor(HexColor('#888888'))
        canvas.setFont('Helvetica', 10)
        canvas.drawCentredString(cx, 118, "© 2026 NicheHunt. All rights reserved.")
        canvas.restoreState()

class BackPage(Flowable):
    """Custom flowable for the back/CTA page."""
    def __init__(self):
        Flowable.__init__(self)
        self.width = PAGE_W
        self.height = PAGE_H
    def wrap(self, availWidth, availHeight):
        return (0, 0)
    def drawOn(self, canvas, x, y, _sW=0):
        canvas.saveState()
        canvas.setFillColor(NAVY)
        canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
        cx = PAGE_W / 2
        canvas.setFillColor(WHITE)
        canvas.setFont('Helvetica-Bold', 28)
        canvas.drawCentredString(cx, PAGE_H - 280, "Want Live Updated Data?")
        canvas.setFillColor(GOLD)
        canvas.setFont('Helvetica-Bold', 36)
        canvas.drawCentredString(cx, PAGE_H - 340, "nichehunt.xyz")
        canvas.setFillColor(HexColor('#aaaaaa'))
        canvas.setFont('Helvetica', 14)
        canvas.drawCentredString(cx, PAGE_H - 400, "Real-time YouTube niche analytics, updated daily.")
        canvas.drawCentredString(cx, PAGE_H - 425, "Find your perfect niche before the competition does.")
        # Gold accent
        canvas.setStrokeColor(GOLD)
        canvas.setLineWidth(3)
        canvas.line(150, PAGE_H - 460, PAGE_W - 150, PAGE_H - 460)
        canvas.restoreState()

def make_styles():
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle('SectionTitle', fontName='Helvetica-Bold', fontSize=20,
                              textColor=NAVY, spaceAfter=12, spaceBefore=24))
    styles.add(ParagraphStyle('SubTitle', fontName='Helvetica-Bold', fontSize=14,
                              textColor=NAVY, spaceAfter=8, spaceBefore=16))
    styles.add(ParagraphStyle('Body', fontName='Helvetica', fontSize=10,
                              textColor=DARK_GRAY, spaceAfter=6, leading=14))
    styles.add(ParagraphStyle('CellText', fontName='Helvetica', fontSize=8.5,
                              textColor=DARK_GRAY, leading=11))
    styles.add(ParagraphStyle('CellBold', fontName='Helvetica-Bold', fontSize=8.5,
                              textColor=DARK_GRAY, leading=11))
    styles.add(ParagraphStyle('TOCEntry', fontName='Helvetica', fontSize=11,
                              textColor=DARK_GRAY, spaceAfter=4, leading=16))
    styles.add(ParagraphStyle('TOCCat', fontName='Helvetica-Bold', fontSize=12,
                              textColor=NAVY, spaceAfter=4, leading=16))
    return styles

def build_summary_table(title, items, value_key, value_fmt, styles):
    """Build a compact top-10 table for executive summary."""
    elements = []
    elements.append(Paragraph(title, styles['SubTitle']))
    header = ['#', 'Niche', 'Category', value_key]
    data = [header]
    for i, n in enumerate(items[:10], 1):
        data.append([str(i), n['name'], n.get('category','').title(), value_fmt(n)])
    col_widths = [25, 180, 100, 100]
    t = Table(data, colWidths=col_widths)
    style = [
        ('BACKGROUND', (0, 0), (-1, 0), NAVY),
        ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 8),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 8.5),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, LIGHT_GRAY]),
        ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#cccccc')),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ]
    t.setStyle(TableStyle(style))
    elements.append(t)
    elements.append(Spacer(1, 16))
    return elements

def build_category_table(cat_name, cat_niches, styles):
    """Build a category section with header bar and table."""
    elements = []
    # Navy header bar
    header_data = [[Paragraph(f'<font color="white"><b>{cat_name}</b></font> — {len(cat_niches)} niches',
                              ParagraphStyle('cathead', fontName='Helvetica-Bold', fontSize=13,
                                            textColor=WHITE, leading=18))]]
    ht = Table(header_data, colWidths=[PAGE_W - 108])
    ht.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), NAVY),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
    ]))
    elements.append(ht)
    elements.append(Spacer(1, 6))

    # Table
    header = ['Niche', 'Difficulty', 'CPM', 'Trend', 'Competition', 'Eng. Rate']
    data = [header]
    for n in sorted(cat_niches, key=lambda x: parse_cpm_avg(x.get('cpm', '$0')), reverse=True):
        diff = n.get('difficulty', 'Unknown')
        dc = difficulty_color(diff)
        trend_status = n.get('trend', {}).get('status', 'Unknown')
        comp = n.get('metrics', {}).get('competitionLevel', 'N/A')
        eng = n.get('metrics', {}).get('avgEngagementRate', 'N/A')
        if eng != 'N/A':
            eng = f"{eng}%"
        data.append([
            Paragraph(n['name'], styles['CellBold']),
            Paragraph(f'<font color="#{dc.hexval()[2:]}">{diff}</font>', styles['CellText']),
            n.get('cpm', 'N/A'),
            trend_status,
            comp,
            eng,
        ])

    col_widths = [130, 75, 65, 65, 70, 60]
    t = Table(data, colWidths=col_widths, repeatRows=1)
    style = [
        ('BACKGROUND', (0, 0), (-1, 0), HexColor('#2a2a4e')),
        ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 8),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 8.5),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, LIGHT_GRAY]),
        ('GRID', (0, 0), (-1, -1), 0.4, HexColor('#dddddd')),
        ('LINEBELOW', (0, 0), (-1, 0), 1.5, GOLD),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ]
    t.setStyle(TableStyle(style))
    elements.append(t)
    elements.append(Spacer(1, 20))
    return elements

def build_pdf():
    doc = SimpleDocTemplate(
        "NicheHunt-Database-2026.pdf",
        pagesize=letter,
        topMargin=54, bottomMargin=54, leftMargin=54, rightMargin=54
    )
    styles = make_styles()
    story = []

    # Cover
    build_cover(story)

    # Table of Contents (placeholder page numbers - we'll use simple listing)
    story.append(Paragraph("Table of Contents", styles['SectionTitle']))
    story.append(Spacer(1, 8))
    sorted_cats = sorted(categories.keys())
    for cat in sorted_cats:
        count = len(categories[cat])
        story.append(Paragraph(f"<b>{cat}</b> — {count} niches", styles['TOCCat']))
    story.append(Spacer(1, 12))
    story.append(Paragraph("Executive Summary — Top 10 Rankings", styles['TOCEntry']))
    story.append(Paragraph(f"Category Breakdowns — {len(sorted_cats)} Categories", styles['TOCEntry']))
    story.append(PageBreak())

    # Executive Summary
    story.append(Paragraph("Executive Summary", styles['SectionTitle']))
    story.append(Paragraph(
        f"This report analyzes <b>{len(niches)} YouTube niches</b> across {len(categories)} categories, "
        "ranking them by CPM rates, difficulty, competition levels, and growth trends. "
        "Use this data to identify high-value content opportunities.",
        styles['Body']))
    story.append(Spacer(1, 8))

    # Top 10 by CPM
    by_cpm = sorted(niches, key=lambda x: parse_cpm_avg(x.get('cpm', '$0')), reverse=True)
    story.extend(build_summary_table("💰 Top 10 by CPM", by_cpm, 'CPM',
                                      lambda n: n.get('cpm', 'N/A'), styles))

    # Top 10 Easiest
    by_easy = sorted(niches, key=lambda x: x.get('difficultyScore', 100))
    story.extend(build_summary_table("🟢 Top 10 Easiest to Enter", by_easy, 'Difficulty',
                                      lambda n: n.get('difficulty', 'N/A'), styles))

    # Top 10 Trending
    by_trend = sorted(niches, key=lambda x: x.get('trend', {}).get('score', 0), reverse=True)
    story.extend(build_summary_table("📈 Top 10 Trending", by_trend, 'Trend',
                                      lambda n: n.get('trend', {}).get('status', 'N/A'), styles))

    story.append(PageBreak())

    # Category sections
    for cat in sorted_cats:
        story.extend(build_category_table(cat, categories[cat], styles))

    # Back page
    story.append(PageBreak())
    story.append(BackPage())

    doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
    print(f"✅ Generated NicheHunt-Database-2026.pdf")

if __name__ == "__main__":
    build_pdf()
