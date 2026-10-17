# Cloud Resume Challenge on Azure

My resume as a live website on Microsoft Azure, with a visitor counter, built end to end: static hosting, HTTPS, DNS, JavaScript, an API, a database, Python, tests, infrastructure as code and CI/CD.

**Live site:** https://salmon-ground-09368c300.4.azurestaticapps.net/

## Architecture

```
Browser ──HTTPS──> custom domain (Azure DNS)
                     │
                     ▼
        Azure Static Web Apps (Free)      frontend/
                     │  fetch("/api/counter")
                     ▼
        Azure Functions (Python)          api/
                     │
                     ▼
        Azure Cosmos DB for NoSQL (free tier)

GitHub ──GitHub Actions──> tests ──> Bicep deploy ──> site + API
```

## Folders

| Folder | What's in it |
|---|---|
| `frontend/` | The resume page: HTML, CSS and the counter script |
| `api/` | Python Azure Function that counts visitors |
| `tests/` | pytest tests for the API |
| `infra/` | Bicep files that create the Azure resources |
| `.github/workflows/` | GitHub Actions pipelines |

## Progress

- [x] Resume page in HTML/CSS
- [x] Hosted on Azure Static Web Apps (HTTPS included)
- [ ] Custom domain with Azure DNS
- [ ] JavaScript visitor counter
- [ ] Cosmos DB table for the count
- [ ] Python Azure Function API
- [ ] pytest tests
- [ ] Infrastructure as code with Bicep
- [ ] CI/CD with GitHub Actions
- [ ] Blog post about the build

## Run it locally

Open `frontend/index.html` in a browser. The API and tests get their own instructions once they exist.
