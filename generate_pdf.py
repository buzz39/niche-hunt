#!/usr/bin/env python3
"""Generate the NicheHunt premium PDF deliverable."""
import json
from fpdf import FPDF

with open("niches.json") as f:
    niches = json.load(f)

# Group by category
categories = {}
for n in niches:
    cat = n["category"]
    categories.setdefault(cat, []).append(n)

def parse_cpm_min(cpm):
    import re
    m = re.search(r'\$(\d+)', cpm)
    return int(m.group(1)) if m else 0

def parse_cpm_max(cpm):
    import re
    ms = re.findall(r'\$(\d+)', cpm)
    return int(ms[-1]) if ms else 0

# Sort helpers
top_by_cpm = sorted(niches, key=lambda n: parse_cpm_max(n["cpm"]), reverse=True)[:10]
top_easiest = sorted(niches, key=lambda n: n["difficultyScore"])[:10]
top_trending = [n for n in niches if n["trend"]["status"] == "Rising"]
top_trending.sort(key=lambda n: n["trend"]["score"], reverse=True)
top_trending = top_trending[:10]

class PDF(FPDF):
    def header(self):
        if self.page_no() > 1:
            self.set_font("Helvetica", "I", 8)
            self.set_text_color(130, 130, 130)
            self.cell(0, 8, "NicheHunt Database 2026 - nichehunt.xyz", align="C")
            self.ln(4)
            self.set_draw_color(200, 200, 200)
            self.line(10, self.get_y(), 200, self.get_y())
            self.ln(4)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(150, 150, 150)
        self.cell(0, 10, f"Page {self.page_no()}/{{nb}}", align="C")

pdf = PDF()
pdf.alias_nb_pages()
pdf.set_auto_page_break(auto=True, margin=20)

# ─── COVER PAGE ───
pdf.add_page()
pdf.ln(50)
pdf.set_font("Helvetica", "B", 36)
pdf.set_text_color(16, 185, 129)  # emerald
pdf.cell(0, 15, "NicheHunt", align="C", new_x="LMARGIN", new_y="NEXT")
pdf.set_font("Helvetica", "B", 24)
pdf.set_text_color(30, 30, 30)
pdf.cell(0, 12, "Database 2026", align="C", new_x="LMARGIN", new_y="NEXT")
pdf.ln(8)
pdf.set_font("Helvetica", "", 16)
pdf.set_text_color(80, 80, 80)
pdf.cell(0, 10, f"{len(niches)} YouTube Niches Analyzed", align="C", new_x="LMARGIN", new_y="NEXT")
pdf.cell(0, 10, f"{len(categories)} Categories | CPM, Difficulty, Trends & More", align="C", new_x="LMARGIN", new_y="NEXT")
pdf.ln(20)
pdf.set_font("Helvetica", "", 11)
pdf.set_text_color(100, 100, 100)
pdf.cell(0, 8, "Data sourced from YouTube Data API v3 & Google Trends", align="C", new_x="LMARGIN", new_y="NEXT")
pdf.cell(0, 8, "Updated March 2026", align="C", new_x="LMARGIN", new_y="NEXT")
pdf.ln(30)
pdf.set_font("Helvetica", "B", 12)
pdf.set_text_color(16, 185, 129)
pdf.cell(0, 8, "Live updated data: nichehunt.xyz", align="C", new_x="LMARGIN", new_y="NEXT")

# ─── HOW TO USE ───
pdf.add_page()
pdf.set_font("Helvetica", "B", 22)
pdf.set_text_color(30, 30, 30)
pdf.cell(0, 12, "How to Use This Guide", new_x="LMARGIN", new_y="NEXT")
pdf.ln(4)
pdf.set_font("Helvetica", "", 11)
pdf.set_text_color(50, 50, 50)

guide_text = [
    ("1. Understand the Metrics", "Each niche includes a difficulty score (1-100), estimated CPM range, trend direction, competition level, average subscriber counts, engagement rates, and upload frequency. Use these together to find your sweet spot."),
    ("2. Filter by Your Experience Level", "New to YouTube? Focus on niches with difficulty scores under 30 (marked 'Low'). These have fewer dominant players and lower production requirements. Experienced? Higher-difficulty niches often have better CPM."),
    ("3. Check the Trend", "Rising niches are growing in demand - getting in early gives you an advantage. Stable niches are reliable. Declining niches may still be profitable but require a unique angle."),
    ("4. Evaluate CPM vs Competition", "High CPM + Low Competition = Gold. Sort by CPM and cross-reference with difficulty. The summary tables at the end highlight the best opportunities."),
    ("5. Use the Website for Live Data", "This PDF is a snapshot. Visit nichehunt.xyz for the most current data, searchable and filterable in real-time."),
]
for title, body in guide_text:
    pdf.ln(3)
    pdf.set_font("Helvetica", "B", 12)
    pdf.set_text_color(16, 185, 129)
    pdf.cell(0, 8, title, new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(50, 50, 50)
    pdf.multi_cell(0, 5.5, body)

# ─── TABLE OF CONTENTS ───
pdf.add_page()
pdf.set_font("Helvetica", "B", 22)
pdf.set_text_color(30, 30, 30)
pdf.cell(0, 12, "Table of Contents", new_x="LMARGIN", new_y="NEXT")
pdf.ln(6)
pdf.set_font("Helvetica", "", 11)
pdf.set_text_color(50, 50, 50)

sorted_cats = sorted(categories.keys())
for cat in sorted_cats:
    count = len(categories[cat])
    pdf.cell(0, 7, f"  {cat.title()} ({count} niches)", new_x="LMARGIN", new_y="NEXT")

pdf.ln(4)
pdf.cell(0, 7, "  Summary: Top 10 by CPM", new_x="LMARGIN", new_y="NEXT")
pdf.cell(0, 7, "  Summary: Top 10 Easiest", new_x="LMARGIN", new_y="NEXT")
pdf.cell(0, 7, "  Summary: Top 10 Trending Up", new_x="LMARGIN", new_y="NEXT")

# ─── NICHE PAGES BY CATEGORY ───
def render_niche(pdf, n, idx):
    # Check space
    if pdf.get_y() > 230:
        pdf.add_page()
    
    # Niche header
    pdf.set_font("Helvetica", "B", 13)
    pdf.set_text_color(30, 30, 30)
    pdf.cell(0, 8, f"{idx}. {n['name']}", new_x="LMARGIN", new_y="NEXT")
    
    pdf.set_font("Helvetica", "", 9.5)
    pdf.set_text_color(70, 70, 70)
    
    # Key metrics line
    diff_color = (16, 185, 129) if n["difficultyScore"] <= 30 else (234, 179, 8) if n["difficultyScore"] <= 60 else (239, 68, 68)
    
    line1 = f"Category: {n['category'].title()}  |  CPM: {n['cpm']}  |  Difficulty: {n['difficulty']} ({n['difficultyScore']}/100)  |  Trend: {n['trend']['status']}"
    pdf.cell(0, 5.5, line1, new_x="LMARGIN", new_y="NEXT")
    
    line2 = f"Monetization: {n['monetization']}"
    pdf.cell(0, 5.5, line2, new_x="LMARGIN", new_y="NEXT")
    
    m = n["metrics"]
    line3 = f"Channels Analyzed: {m['totalChannels']}  |  Avg Subscribers: {m['avgSubscribers']:,}  |  Avg Views: {m['avgViews']:,}"
    pdf.cell(0, 5.5, line3, new_x="LMARGIN", new_y="NEXT")
    
    line4 = f"Top Channel: {m['topChannelSubs']:,} subs  |  Competition: {m['competitionLevel']}  |  Engagement: {m['avgEngagementRate']}%  |  Upload Freq: {m['uploadFrequency']}/month"
    pdf.cell(0, 5.5, line4, new_x="LMARGIN", new_y="NEXT")
    
    # Description
    if n.get("description"):
        pdf.set_font("Helvetica", "I", 9)
        pdf.set_text_color(100, 100, 100)
        pdf.multi_cell(0, 5, n["description"])
    
    pdf.ln(4)
    pdf.set_draw_color(220, 220, 220)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(3)

idx = 1
for cat in sorted_cats:
    pdf.add_page()
    pdf.set_font("Helvetica", "B", 20)
    pdf.set_text_color(16, 185, 129)
    pdf.cell(0, 12, f"{cat.title()}", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(100, 100, 100)
    pdf.cell(0, 6, f"{len(categories[cat])} niches in this category", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(6)
    
    for n in sorted(categories[cat], key=lambda x: x["difficultyScore"]):
        render_niche(pdf, n, idx)
        idx += 1

# ─── SUMMARY TABLES ───
def render_summary_table(pdf, title, data, value_fn):
    pdf.add_page()
    pdf.set_font("Helvetica", "B", 20)
    pdf.set_text_color(16, 185, 129)
    pdf.cell(0, 12, title, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)
    
    # Header
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(255, 255, 255)
    pdf.set_fill_color(30, 30, 30)
    pdf.cell(8, 8, "#", border=1, fill=True, align="C")
    pdf.cell(60, 8, "Niche", border=1, fill=True)
    pdf.cell(30, 8, "Category", border=1, fill=True)
    pdf.cell(25, 8, "CPM", border=1, fill=True, align="C")
    pdf.cell(25, 8, "Difficulty", border=1, fill=True, align="C")
    pdf.cell(25, 8, "Trend", border=1, fill=True, align="C")
    pdf.cell(17, 8, "Value", border=1, fill=True, align="C")
    pdf.ln()
    
    pdf.set_font("Helvetica", "", 9)
    pdf.set_text_color(50, 50, 50)
    for i, n in enumerate(data):
        bg = (245, 245, 245) if i % 2 == 0 else (255, 255, 255)
        pdf.set_fill_color(*bg)
        pdf.cell(8, 7, str(i+1), border=1, fill=True, align="C")
        name = n["name"][:30]
        pdf.cell(60, 7, name, border=1, fill=True)
        pdf.cell(30, 7, n["category"].title(), border=1, fill=True)
        pdf.cell(25, 7, n["cpm"], border=1, fill=True, align="C")
        pdf.cell(25, 7, f"{n['difficultyScore']}/100", border=1, fill=True, align="C")
        pdf.cell(25, 7, n["trend"]["status"], border=1, fill=True, align="C")
        pdf.cell(17, 7, str(value_fn(n)), border=1, fill=True, align="C")
        pdf.ln()

render_summary_table(pdf, "Top 10 by Highest CPM", top_by_cpm, lambda n: n["cpm"])
render_summary_table(pdf, "Top 10 Easiest to Enter", top_easiest, lambda n: f"{n['difficultyScore']}")
render_summary_table(pdf, "Top 10 Trending Up", top_trending, lambda n: f"{n['trend']['score']}")

# ─── FINAL PAGE ───
pdf.add_page()
pdf.ln(40)
pdf.set_font("Helvetica", "B", 24)
pdf.set_text_color(16, 185, 129)
pdf.cell(0, 12, "Thank You!", align="C", new_x="LMARGIN", new_y="NEXT")
pdf.ln(8)
pdf.set_font("Helvetica", "", 12)
pdf.set_text_color(80, 80, 80)
pdf.cell(0, 8, "Visit nichehunt.xyz for live, searchable, updated data.", align="C", new_x="LMARGIN", new_y="NEXT")
pdf.cell(0, 8, "Questions? Email hello@g-compilations.com", align="C", new_x="LMARGIN", new_y="NEXT")
pdf.ln(10)
pdf.set_font("Helvetica", "", 10)
pdf.set_text_color(150, 150, 150)
pdf.cell(0, 8, "© 2026 NicheHunt. All rights reserved.", align="C", new_x="LMARGIN", new_y="NEXT")

pdf.output("NicheHunt-Database-2026.pdf")
print(f"PDF generated: {len(niches)} niches, {len(categories)} categories, {pdf.page_no()} pages")
