from bs4 import BeautifulSoup


def parse_vocab_status(html: str):
    soup = BeautifulSoup(html, "html.parser")

    progress_section = soup.find("h4", string="Your learning progress")
    if not progress_section:
        return None

    container = progress_section.find_next("div")

    table = container.find("table")
    words_direct_row = table.find_all("tr")[1]
    total_learning = int(words_direct_row.find_all("td")[2].text.strip())

    total_known = None
    for p in container.find_all("p", limit=5):
        if "Total known non-redundant vocabulary" in p.text:
            total_known = int(p.text.split(":")[-1].strip())
            break

    return {
        "known": total_known,
        "learning": total_learning,
    }
