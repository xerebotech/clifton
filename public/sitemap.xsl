<?xml version="1.0" encoding="UTF-8"?>
<!--
  Renders /sitemap.xml as a readable page when a person opens it in a browser.
  Crawlers ignore the stylesheet and read the XML directly, so this has no
  effect on indexing. Browsers do not run scripts from an XSLT result, so the
  page is plain HTML and CSS.
-->
<xsl:stylesheet
    version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
    exclude-result-prefixes="sitemap">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="robots" content="noindex,follow"/>
        <title>XML Sitemap | Clifton Capital Real Estate</title>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&amp;display=swap"/>
        <style type="text/css">
          /* Site palette: green #23312D, gold #AE9573, sand #B4A68C */
          :root { --green: #23312D; --gold: #AE9573; --sand: #B4A68C; --cream: #FAF8F4; --line: #ECE6DC; }
          * { box-sizing: border-box; }
          body { margin: 0; background: var(--cream); color: var(--green); font: 14px/1.5 ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif; }
          header { background: var(--green); color: #fff; padding: 48px 16px 40px; }
          .wrap { max-width: 1100px; margin: 0 auto; }
          .eyebrow { display: flex; align-items: center; gap: 10px; color: var(--gold); font-size: 11px; font-weight: 700; letter-spacing: .25em; text-transform: uppercase; margin-bottom: 14px; }
          .eyebrow::before { content: ""; width: 32px; height: 1px; background: var(--gold); }
          h1 { font-family: "Cinzel", Georgia, serif; font-weight: 500; font-size: 34px; line-height: 1.15; margin: 0 0 10px; }
          h1 span { color: var(--gold); }
          .lede { margin: 0; max-width: 640px; color: rgba(255,255,255,.65); }
          .lede a { color: var(--gold); text-decoration: none; border-bottom: 1px solid rgba(174,149,115,.4); }
          main { padding: 32px 16px 48px; }
          .stats { display: flex; flex-wrap: wrap; gap: 12px; margin: 0 0 20px; }
          .stat { background: #fff; border: 1px solid var(--line); padding: 10px 16px; }
          .stat b { font-family: "Cinzel", Georgia, serif; font-size: 20px; margin-right: 6px; }
          .stat small { color: rgba(35,49,45,.6); text-transform: uppercase; letter-spacing: .12em; font-size: 10px; font-weight: 700; }
          .table-wrap { overflow-x: auto; background: #fff; border: 1px solid var(--line); }
          table { width: 100%; border-collapse: collapse; min-width: 560px; }
          th { text-align: left; padding: 14px 18px; font-size: 10px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: var(--gold); border-bottom: 2px solid var(--green); }
          td { padding: 13px 18px; border-bottom: 1px solid var(--line); vertical-align: top; }
          tr:last-child td { border-bottom: none; }
          tbody tr:hover td { background: #FBF9F5; }
          td a { color: var(--green); text-decoration: none; word-break: break-all; }
          td a:hover { color: var(--gold); }
          .tag { display: inline-block; margin-left: 8px; padding: 1px 8px; font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--gold); border: 1px solid rgba(174,149,115,.5); }
          .num { white-space: nowrap; font-variant-numeric: tabular-nums; color: rgba(35,49,45,.7); }
          .muted { color: rgba(35,49,45,.35); }
          footer { margin-top: 18px; text-align: center; font-size: 12px; color: rgba(35,49,45,.5); }
          @media (max-width: 600px) { h1 { font-size: 26px; } header { padding: 36px 16px 28px; } }
        </style>
      </head>
      <body>
        <header>
          <div class="wrap">
            <div class="eyebrow">Clifton Capital Real Estate</div>
            <h1>XML <span>Sitemap</span></h1>
            <p class="lede">
              Every page on cliftonuae.com that search engines are invited to index.
              Learn more about sitemaps at
              <a href="https://www.sitemaps.org" rel="noopener">sitemaps.org</a>.
            </p>
          </div>
        </header>
        <main>
          <div class="wrap">
            <xsl:variable name="all" select="sitemap:urlset/sitemap:url"/>
            <xsl:variable name="posts" select="$all[contains(sitemap:loc, '/blog/')]"/>
            <div class="stats">
              <div class="stat"><b><xsl:value-of select="count($all)"/></b><small>URLs</small></div>
              <div class="stat"><b><xsl:value-of select="count($all) - count($posts)"/></b><small>Pages</small></div>
              <div class="stat"><b><xsl:value-of select="count($posts)"/></b><small>Blog posts</small></div>
            </div>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>URL</th>
                    <th>Priority</th>
                    <th>Change frequency</th>
                    <th>Last modified</th>
                  </tr>
                </thead>
                <tbody>
                  <xsl:for-each select="$all">
                    <tr>
                      <td>
                        <a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
                        <xsl:if test="contains(sitemap:loc, '/blog/')">
                          <span class="tag">Blog</span>
                        </xsl:if>
                      </td>
                      <td class="num">
                        <xsl:choose>
                          <xsl:when test="sitemap:priority">
                            <xsl:value-of select="format-number(number(sitemap:priority) * 100, '0')"/>%
                          </xsl:when>
                          <xsl:otherwise><span class="muted">—</span></xsl:otherwise>
                        </xsl:choose>
                      </td>
                      <td class="num">
                        <xsl:choose>
                          <xsl:when test="sitemap:changefreq"><xsl:value-of select="sitemap:changefreq"/></xsl:when>
                          <xsl:otherwise><span class="muted">—</span></xsl:otherwise>
                        </xsl:choose>
                      </td>
                      <td class="num">
                        <xsl:choose>
                          <xsl:when test="sitemap:lastmod">
                            <xsl:value-of select="concat(substring(sitemap:lastmod, 1, 10), ' ', substring(sitemap:lastmod, 12, 5))"/>
                          </xsl:when>
                          <xsl:otherwise><span class="muted">—</span></xsl:otherwise>
                        </xsl:choose>
                      </td>
                    </tr>
                  </xsl:for-each>
                </tbody>
              </table>
            </div>
            <footer>Clifton Capital Real Estate LLC · Dubai</footer>
          </div>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
