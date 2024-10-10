from textblob import TextBlob
import language_tool_python
import requests
import re

def enhance_sentence_rule_based(sentence):
    replacements = {
    r"\bresponsible for\b": "led",
    r"\bmanaging a team of\b": "leading",
    r"\boverseeing\b": "directing",
    r"\bdeveloped\b": "created",
    r"\bexecuted\b": "implemented",
    r"\bsuccessfully\b": "effectively",
    r"\bperformed\b": "achieved",
    r"\bin charge of\b": "managed",
    r"\bdirected\b": "oversaw",
    r"\bimplemented\b": "deployed",
    r"\bcoordinated\b": "orchestrated",
    r"\boptimized\b": "enhanced",
    r"\bimproved\b": "boosted",
    r"\butilized\b": "leveraged",
    r"\bdelivered\b": "completed",
    r"\bconducted\b": "executed",
    r"\bcreated\b": "designed",
    r"\banalyzed\b": "assessed",
    r"\bassisted\b": "supported",
    r"\bexecuted\b": "carried out",
    r"\bdelivered\b": "achieved",
    r"\bstreamlined\b": "simplified",
    r"\bmanaged\b": "oversaw",
    r"\bmonitored\b": "tracked",
    r"\bfacilitated\b": "coordinated",
    r"\bhandled\b": "addressed",
    r"\bled\b": "championed",
    r"\bresolved\b": "solved",
    r"\borganized\b": "arranged",
    r"\btrained\b": "mentored",
    r"\bmaintained\b": "sustained",
    r"\bplanned\b": "strategized",
    r"\bdesigned\b": "crafted",
    r"\bcreated\b": "developed",
    r"\bincreased\b": "boosted",
    r"\bpromoted\b": "advocated",
    r"\binitiated\b": "commenced",
    r"\butilized\b": "employed",
    r"\bcommunicated\b": "conveyed",
    r"\bcollaborated\b": "partnered",
    r"\bacquired\b": "obtained",
    r"\bnegotiated\b": "bargained",
    r"\bcoordinated\b": "synchronized",
    r"\bestablished\b": "founded",
    r"\bexecuted\b": "enacted",
    r"\bgenerated\b": "produced",
    r"\binfluenced\b": "persuaded",
    r"\bled\b": "spearheaded",
    r"\bmaximized\b": "optimized",
    r"\bparticipated in\b": "contributed to",
    r"\bresearched\b": "investigated",
    r"\bset up\b": "established",
    r"\bsupported\b": "aided",
    r"\btransformed\b": "converted",
    r"\bwon\b": "secured",
    r"\bcrafted\b": "formulated",
    r"\bdesigned\b": "conceived",
    r"\bdebugged\b": "troubleshot",
    r"\baddressed\b": "resolved",
    r"\badministered\b": "managed",
    r"\badvised\b": "counseled",
    r"\bapproved\b": "authorized",
    r"\barranged\b": "organized",
    r"\bauthorized\b": "approved",
    r"\bcalculated\b": "computed",
    r"\bclassified\b": "categorized",
    r"\bcompiled\b": "assembled",
    r"\bconsolidated\b": "merged",
    r"\bcontrolled\b": "regulated",
    r"\bconverted\b": "transformed",
    r"\bconveyed\b": "communicated",
    r"\bdelegated\b": "assigned",
    r"\bdeveloped\b": "devised",
    r"\bdrafted\b": "composed",
    r"\benabled\b": "facilitated",
    r"\benforced\b": "implemented",
    r"\bengineered\b": "designed",
    r"\benhanced\b": "improved",
    r"\bevaluated\b": "assessed",
    r"\bexamined\b": "inspected",
    r"\bexecuted\b": "administered",
    r"\bexpanded\b": "extended",
    r"\bexplained\b": "clarified",
    r"\bforecasted\b": "predicted",
    r"\bformulated\b": "developed",
    r"\bfounded\b": "established",
    r"\bgathered\b": "collected",
    r"\bguided\b": "mentored",
    r"\bheaded\b": "led",
    r"\bimplemented\b": "executed",
    r"\binitiated\b": "launched",
    r"\binspected\b": "examined",
    r"\binterpreted\b": "analyzed",
    r"\bintroduced\b": "initiated",
    r"\binvented\b": "created",
    r"\bleveraged\b": "utilized",
    r"\bliaised\b": "communicated",
    r"\bmaintained\b": "preserved",
    r"\bmentored\b": "coached",
    r"\bminimized\b": "reduced",
    r"\bmoderated\b": "facilitated",
    r"\bnegotiated\b": "brokered",
    r"\boperated\b": "managed",
    r"\boptimized\b": "maximized",
    r"\borganized\b": "arranged",
    r"\bpioneered\b": "initiated",
    r"\bplanned\b": "organized",
    r"\bprocessed\b": "handled",
    r"\bproduced\b": "created",
    r"\bprojected\b": "forecasted",
    r"\bpromoted\b": "endorsed",
    r"\brectified\b": "corrected",
    r"\bredesigned\b": "revised",
    r"\breorganized\b": "restructured",
    r"\bresearched\b": "investigated",
    r"\bresolved\b": "solved",
    r"\brestored\b": "recovered",
    r"\bsecured\b": "guaranteed",
    r"\bsimplified\b": "streamlined",
    r"\bspearheaded\b": "initiated",
    r"\bsupported\b": "backed",
    r"\bsynthesized\b": "combined",
    r"\btransformed\b": "restructured",
    r"\bupgraded\b": "improved",
    r"\bverified\b": "validated"
}

    
    improved_sentence = sentence
    for pattern, replacement in replacements.items():
        improved_sentence = re.sub(pattern, replacement, improved_sentence, flags=re.IGNORECASE)
    
    improved_sentence = ' '.join(improved_sentence.split())
    return improved_sentence

def improve_sentence_with_language_tool(sentence):
    tool = language_tool_python.LanguageTool('en-US')
    matches = tool.check(sentence)
    improved_sentence = tool.correct(sentence)
    return improved_sentence

def abbreviate_if_present(text):
    abbreviation_dict = {
    'Human Resources': 'HR',
    'Information Technology': 'IT',
    'Chief Executive Officer': 'CEO',
    'Chief Technology Officer': 'CTO',
    'Chief Financial Officer': 'CFO',
    'Chief Operating Officer': 'COO',
    'Vice President': 'VP',
    'Project Manager': 'PM',
    'Customer Relationship Management': 'CRM',
    'Key Performance Indicator': 'KPI',
    'Return on Investment': 'ROI',
    'Software as a Service': 'SaaS',
    'Business to Business': 'B2B',
    'Business to Consumer': 'B2C',
    'User Interface': 'UI',
    'User Experience': 'UX',
    'Amazon Web Services': 'AWS',
    'Continuous Integration/Continuous Deployment': 'CI/CD',
    'Internet of Things': 'IoT',
    'Local Area Network': 'LAN',
    'Wide Area Network': 'WAN',
    'Doctor of Philosophy': 'PhD',
    'Grade Point Average': 'GPA',
    'Fiscal Year': 'FY',
    'Standard Operating Procedure': 'SOP',
    'Frequently Asked Questions': 'FAQ',
    'Request for Proposal': 'RFP',
    'Request for Quotation': 'RFQ',
    'To Be Announced': 'TBA',
    'To Be Determined': 'TBD',
    'Machine Learning': 'ML',
    'Artificial Intelligence': 'AI',
    'Natural Language Processing': 'NLP',
    'Computer Vision': 'CV',
    'HyperText Transfer Protocol': 'HTTP',
    'Application Programming Interface': 'API',
    'Structured Query Language': 'SQL',
    'Cascading Style Sheets': 'CSS',
    'HyperText Markup Language': 'HTML',
    'Document Object Model': 'DOM',
    'Single Sign-On': 'SSO',
    'Virtual Private Network': 'VPN',
    'Content Management System': 'CMS',
    'Enterprise Resource Planning': 'ERP',
    'Gross Domestic Product': 'GDP',
    'Supply Chain Management': 'SCM',
    'Customer Data Platform': 'CDP',
    'Data Management Platform': 'DMP',
    'Internet Protocol': 'IP',
    'Transmission Control Protocol': 'TCP',
    'Internet Protocol Suite': 'TCP/IP',
    'Dynamic Host Configuration Protocol': 'DHCP',
    'Domain Name System': 'DNS',
    'Internet Service Provider': 'ISP',
    'Point of Sale': 'POS',
    'Quality Assurance': 'QA',
    'Quality Control': 'QC',
    'Research and Development': 'R&D',
    'Service Level Agreement': 'SLA',
    'Software Development Life Cycle': 'SDLC',
    'User Acceptance Testing': 'UAT',
    'Weighted Average Cost of Capital': 'WACC',
    'Earnings Before Interest, Taxes, Depreciation, and Amortization': 'EBITDA',
    'Return on Equity': 'ROE',
    'Earnings Per Share': 'EPS',
    'Business Intelligence': 'BI',
    'Chief Marketing Officer': 'CMO',
    'Chief Information Officer': 'CIO',
    'Chief Data Officer': 'CDO',
    'Internet of Things': 'IoT',
    'Information and Communications Technology': 'ICT',
    'Management Information System': 'MIS',
    'Enterprise Content Management': 'ECM',
    'Human-Computer Interaction': 'HCI',
    'Human-Machine Interface': 'HMI',
    'Master of Business Administration': 'MBA',
    'Master of Science': 'MS',
    'Bachelor of Science': 'BS',
    'Bachelor of Arts': 'BA',
    'Doctor of Medicine': 'MD',
    'Registered Nurse': 'RN',
    'Certified Public Accountant': 'CPA',
    'International Financial Reporting Standards': 'IFRS',
    'Generally Accepted Accounting Principles': 'GAAP',
    'Accounts Payable': 'AP',
    'Accounts Receivable': 'AR',
    'Value Added Tax': 'VAT',
    'Point of Sale': 'POS',
    'Business Process Outsourcing': 'BPO',
    'Customer Service Representative': 'CSR',
    'Learning Management System': 'LMS',
    'Virtual Learning Environment': 'VLE',
    'Virtual Reality': 'VR',
    'Augmented Reality': 'AR',
    'Extended Reality': 'XR',
    'Application Programming Interface': 'API',
    'Software Development Kit': 'SDK',
    'Integrated Development Environment': 'IDE',
    'Lightweight Directory Access Protocol': 'LDAP',
    'Secure Sockets Layer': 'SSL',
    'Transport Layer Security': 'TLS',
    'Internet of Things': 'IoT',
    'Operating System': 'OS',
    'Central Processing Unit': 'CPU',
    'Graphics Processing Unit': 'GPU',
    'Read-Only Memory': 'ROM',
    'Random Access Memory': 'RAM',
    'Small and Medium-sized Enterprises': 'SME',
    'Enterprise Resource Planning': 'ERP',
    'Product Lifecycle Management': 'PLM',
    'Customer Experience': 'CX',
    'Electronic Data Interchange': 'EDI',
    'Supply Chain Management': 'SCM',
    'Customer Relationship Management': 'CRM',
    'Chief Operating Officer': 'COO',
    'Internet of Things': 'IoT',
    'Business to Consumer': 'B2C',
    'Business to Business': 'B2B',
    'Enterprise Resource Planning': 'ERP',
    'Product Lifecycle Management': 'PLM',
    'Customer Experience': 'CX',
    'Electronic Data Interchange': 'EDI',
    'Supply Chain Management': 'SCM',
    'Customer Relationship Management': 'CRM',
    'Chief Operating Officer': 'COO',
    'Internet of Things': 'IoT',
    'Business to Consumer': 'B2C',
    'Business to Business': 'B2B'
}

    found_abbrs = set()
    for abbr in abbreviation_dict.values():
        if re.search(r'\b' + re.escape(abbr) + r'\b', text, re.IGNORECASE):
            found_abbrs.add(abbr)
    
    for full_form, abbr in abbreviation_dict.items():
        if abbr in found_abbrs:
            pattern = r'\b' + re.escape(full_form) + r'\b(?:\s*\(' + re.escape(abbr) + r'\))?'
            text = re.sub(pattern, abbr, text, flags=re.IGNORECASE)
    
    text = ' '.join(text.split())
    return text


def improve_sentence(text):
    improved_sentence = enhance_sentence_rule_based(text)
    improved_sentence = improve_sentence_with_language_tool(improved_sentence)
    improved_sentence = abbreviate_if_present(improved_sentence)
   
    return improved_sentence













# original_sentence = (
#     "Increase annual sales to nearly $5.7 million through strategic marketing & sales campaigns. Launched aggressive growth plans that helped increase customer base from 0 to 15,000 customers. Created strategies to develop and expand existing customer sales, which resulted in a 200% sales growth in less than 12 months."
# )

# # Process the sentence
# improved_sentence = enhance_sentence_rule_based(original_sentence)
# improved_sentence = improve_sentence_with_language_tool(improved_sentence)
# improved_sentence = abbreviate_if_present(improved_sentence)

# print("Original Sentence:", original_sentence)
# print("Improved Sentence:", improved_sentence)
