# Research Sources — hierarchy, claim types, and search patterns

## Source hierarchy by claim type

Match the publisher category to the claim. Using a vendor blog to size a market is how registers lose credibility in diligence.

| Claim type | Trust first | Acceptable | Avoid |
|---|---|---|---|
| Market size and CAGR | Original research-firm reports (Gartner, Forrester, IDC, Grand View, Precedence, MarketsandMarkets, IBISWorld, Statista) cited to the publisher, not a reseller | Strategy consultancies (McKinsey, Deloitte, BCG, Bain, PwC, EY, KPMG, Accenture) and bank equity research (Goldman Sachs, Morgan Stanley, JP Morgan, Citi) | SEO aggregators quoting a figure with no primary attribution |
| Counts of businesses, workers, filings | Government statistics (US Census, BLS, SBA, Eurostat, Statistics Canada, OECD, World Bank) | Trade associations with published membership data | Vendor "state of the industry" surveys with undisclosed samples |
| Regulatory change and deadlines | The regulator's own publication, register, or docket | Law firm client alerts naming the rule and effective date | Journalism summarizing a rule without citing it |
| Adoption and failure rates | Peer-reviewed or institutional studies with disclosed sample sizes | Large-vendor surveys that disclose methodology and n | Any statistic circulating without a traceable origin |
| Competitor funding and revenue | Company filings, press releases, and Crunchbase or PitchBook records | Credible trade press naming the round and date | Estimates on listicles |
| Demand signals | Accelerator requests for startups, job postings, procurement notices, RFPs, dated funding rounds in the category | Practitioner forums and communities where the buyer actually posts | Generic trend pieces |

## Bottom-up sizing is preferred

When a published figure is unavailable or unreliable, build the number and show the arithmetic. Three methods, in descending preference for early-stage work:

**Bottom-up.** Count of buyers multiplied by realistic annual price. Source the buyer count from government or association data. State the count, the price, and the product in one line so a reader can check it.

**Value-based.** Total annual cost of the problem multiplied by the share of that cost the product plausibly captures. Strongest when the cost of the problem is documented in penalties, write-offs, or labor hours.

**Top-down.** A published market size filtered to the reachable segment. Cite the original publisher rather than a secondary reference, and state the filter explicitly. Use this last; unfiltered top-down numbers read as unserious.

Always reconcile: if a bottom-up figure and a top-down figure differ by more than an order of magnitude, say so and explain which is being relied on. Silent inconsistency is the single most common credibility failure in market sections.

## Search patterns that surface dated demand signals

Generic queries return vendor content marketing. These patterns return signals with dates attached.

- Accelerator and fund requests for startups in the target category, filtered to the current or prior batch
- Regulatory dockets, comment periods, and compliance deadlines in the target jurisdiction
- Job postings for the manual role the product would replace, which quantify the labor cost directly
- Public procurement portals and RFPs, which reveal budgeted demand rather than hypothetical demand
- Funding announcements in adjacent categories within the last 18 months, which establish that investors already believe the category exists
- Trade association conference agendas, whose session titles name the problems practitioners are paying to hear about
- Enforcement actions and penalty notices, which convert a compliance topic into a dollar figure

## Recording sources

Maintain a source ledger alongside the register: claim, figure, publisher, publication year, URL, and date accessed. Two reasons. First, market figures decay and a ledger makes refresh cheap. Second, every figure in the eventual `spmp`, `executive-summary`, and `roi-model` traces back to this ledger, so a claim recorded once is reused many times without re-research. Save the ledger to a file as findings emerge rather than holding them in context.

## Verification rule

Before a figure enters the register, confirm the source was actually opened and the figure actually appears there. A number that cannot be traced to an opened source does not enter the register, even when it is probably right. In diligence, one fabricated citation discredits every other number in the document.
