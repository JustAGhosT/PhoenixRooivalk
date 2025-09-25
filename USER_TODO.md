# User TODO: Netlify Deployment Secrets

## NETLIFY_AUTH_TOKEN
- Create in Netlify: User settings > Applications > Personal access tokens > New token.
  - Scope: Full deploy is fine for static sites.
- In GitHub: Repo Settings > Secrets and variables > Actions > New repository secret.
  - Name: NETLIFY_AUTH_TOKEN
  - Value: the token

## NETLIFY_SITE_ID
- In Netlify: Site settings > Site information > Site ID.
- In GitHub: Repo Settings > Secrets and variables > Actions > New repository secret.
  - Name: NETLIFY_SITE_ID
  - Value: the site ID

## Optional: Enable site password (fastest access control)
- Netlify > Site settings > Visitor access > Password protect.
- Set a strong temporary password and share out-of-band.

## Optional: Enable PR deploy previews
- Nothing to do after secrets are set; the workflow will create a preview per PR.
