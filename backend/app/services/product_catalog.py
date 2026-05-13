"""
Canonical product-to-insurer mappings used to prevent brand attribution drift.

This is deliberately structured data, not a prompt-only rule. Add new products
here as the product reference database grows.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Iterable


@dataclass(frozen=True)
class ProductCatalogEntry:
    name: str
    insurers: tuple[str, ...]
    aliases: tuple[str, ...]
    category: str


PRODUCT_CATALOG: tuple[ProductCatalogEntry, ...] = (
    ProductCatalogEntry(
        name="LIC Tech Term",
        insurers=("Life Insurance Corporation of India", "LIC"),
        aliases=("LIC Tech Term", "Tech Term Plan 854", "LIC Tech Term Plan 854"),
        category="term_life",
    ),
    ProductCatalogEntry(
        name="HDFC Life Click 2 Protect Super",
        insurers=("HDFC Life", "HDFC Life Insurance"),
        aliases=("HDFC Click 2 Protect Super", "HDFC Life Click 2 Protect Super", "Click 2 Protect Super"),
        category="term_life",
    ),
    ProductCatalogEntry(
        name="SBI Life eShield Next",
        insurers=("SBI Life", "SBI Life Insurance"),
        aliases=("SBI eShield Next", "SBI Life eShield Next", "eShield Next"),
        category="term_life",
    ),
    ProductCatalogEntry(
        name="Max Life Smart Secure Plus",
        insurers=("Max Life", "Max Life Insurance"),
        aliases=("Max Smart Secure Plus", "Max Life Smart Secure Plus", "Smart Secure Plus"),
        category="term_life",
    ),
    ProductCatalogEntry(
        name="ICICI Pru iProtect Smart",
        insurers=("ICICI Prudential Life", "ICICI Prudential Life Insurance", "ICICI Pru"),
        aliases=("ICICI Pru iProtect Smart", "ICICI iProtect Smart", "iProtect Smart"),
        category="term_life",
    ),
    ProductCatalogEntry(
        name="Bajaj Allianz Smart Protect Goal",
        insurers=("Bajaj Allianz Life", "Bajaj Allianz Life Insurance"),
        aliases=("Bajaj Smart Protect Goal", "Bajaj Allianz Smart Protect Goal", "Smart Protect Goal"),
        category="term_life",
    ),
    ProductCatalogEntry(
        name="LIC Dhan Rekha",
        insurers=("Life Insurance Corporation of India", "LIC"),
        aliases=("LIC Dhan Rekha", "Dhan Rekha"),
        category="savings_life",
    ),
    ProductCatalogEntry(
        name="HDFC Life Sanchay Fixed Maturity",
        insurers=("HDFC Life", "HDFC Life Insurance"),
        aliases=("HDFC Life Sanchay Fixed Maturity", "HDFC Sanchay Fixed Maturity", "Sanchay Fixed Maturity"),
        category="savings_life",
    ),
    ProductCatalogEntry(
        name="ICICI Pru Signature",
        insurers=("ICICI Prudential Life", "ICICI Prudential Life Insurance", "ICICI Pru"),
        aliases=("ICICI Pru Signature", "ICICI Prudential Signature", "Pru Signature"),
        category="ulip",
    ),
    ProductCatalogEntry(
        name="HDFC Life ProGrowth Plus",
        insurers=("HDFC Life", "HDFC Life Insurance"),
        aliases=("HDFC Life ProGrowth Plus", "HDFC ProGrowth Plus", "ProGrowth Plus"),
        category="ulip",
    ),
    ProductCatalogEntry(
        name="SBI Life Smart Wealth Builder",
        insurers=("SBI Life", "SBI Life Insurance"),
        aliases=("SBI Life Smart Wealth Builder", "SBI Smart Wealth Builder", "Smart Wealth Builder"),
        category="ulip",
    ),
    ProductCatalogEntry(
        name="LIC Jeevan Umang",
        insurers=("Life Insurance Corporation of India", "LIC"),
        aliases=("LIC Jeevan Umang", "Jeevan Umang"),
        category="whole_life",
    ),
    ProductCatalogEntry(
        name="HDFC ERGO Optima Secure",
        insurers=("HDFC ERGO", "HDFC ERGO General Insurance"),
        aliases=("HDFC ERGO Optima Secure", "Optima Secure", "myOptima Secure"),
        category="health",
    ),
    ProductCatalogEntry(
        name="Niva Bupa ReAssure 2.0",
        insurers=("Niva Bupa", "Niva Bupa Health Insurance"),
        aliases=("Niva Bupa ReAssure 2.0", "Niva Bupa Reassure 2.0", "ReAssure 2.0", "Reassure 2.0"),
        category="health",
    ),
    ProductCatalogEntry(
        name="Star Senior Citizens Red Carpet",
        insurers=("Star Health and Allied Insurance", "Star Health"),
        aliases=("Star Senior Citizens Red Carpet", "Senior Citizens Red Carpet", "Red Carpet"),
        category="senior_health",
    ),
    ProductCatalogEntry(
        name="Tata AIG Medicare",
        insurers=("Tata AIG", "Tata AIG General Insurance"),
        aliases=("Tata AIG Medicare", "Tata AIG MediCare", "Medicare"),
        category="health",
    ),
    ProductCatalogEntry(
        name="Tata AIG Criti Medicare",
        insurers=("Tata AIG", "Tata AIG General Insurance"),
        aliases=("Tata AIG Criti Medicare", "Criti Medicare"),
        category="critical_illness",
    ),
)


def _normalize(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", value.lower()).strip()


def _contains_alias(text: str, aliases: Iterable[str]) -> bool:
    normalized = _normalize(text)
    return any(_normalize(alias) in normalized for alias in aliases)


def find_relevant_products(text: str, limit: int = 8) -> list[ProductCatalogEntry]:
    matches = [entry for entry in PRODUCT_CATALOG if _contains_alias(text, (entry.name, *entry.aliases))]
    return matches[:limit]


def product_catalog_context(text: str) -> str:
    entries = find_relevant_products(text)
    if not entries:
        return ""

    lines = [
        "Canonical product catalog matches. Treat these product-to-insurer mappings as authoritative:",
    ]
    for entry in entries:
        lines.append(
            f"- {entry.name} | insurer(s): {', '.join(entry.insurers)} | "
            f"aliases: {', '.join(entry.aliases)} | category: {entry.category}"
        )
    return "\n".join(lines)


def correct_product_attributions(answer: str) -> str:
    """
    Correct generic '<product> by/from/of/issued by <wrong insurer>' patterns.
    """
    if not answer:
        return answer

    corrected = answer
    for entry in PRODUCT_CATALOG:
        alias_group = "|".join(re.escape(alias) for alias in sorted((entry.name, *entry.aliases), key=len, reverse=True))
        valid_insurers = {_normalize(insurer) for insurer in entry.insurers}
        pattern = re.compile(
            rf"\b(?P<product>{alias_group})\s+"
            rf"(?P<link>by|from|of|issued by|offered by|provided by)\s+"
            rf"(?P<insurer>[A-Z][A-Za-z&.\s]{{2,80}})",
            flags=re.IGNORECASE,
        )

        def replace(match: re.Match[str]) -> str:
            insurer = match.group("insurer").strip(" .,:;")
            normalized_insurer = _normalize(insurer)
            if any(valid in normalized_insurer or normalized_insurer in valid for valid in valid_insurers):
                return match.group(0)

            canonical = f"{entry.name} by {entry.insurers[0]}"
            trailing = match.group("insurer")[len(insurer):]
            return canonical + trailing

        corrected = pattern.sub(replace, corrected)

    return corrected
