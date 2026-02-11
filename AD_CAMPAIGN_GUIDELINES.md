# Ad Campaign URL Guidelines

## Standard URL Format

**Always use:** `https://realestate.cliftonuae.com/` (without www)

✅ **Correct:** `https://realestate.cliftonuae.com/`  
❌ **Incorrect:** `https://www.realestate.cliftonuae.com/`

> **Note:** The www subdomain automatically redirects to the non-www version, but for consistency in analytics and reporting, always use the non-www format in your ad campaigns.

## UTM Tracking Parameters

Use UTM parameters to track the performance of your ad campaigns. The format is:

```
https://realestate.cliftonuae.com/?utm_source=SOURCE&utm_medium=MEDIUM&utm_campaign=CAMPAIGN_NAME
```

### Required Parameters

- `utm_source` - Where the traffic comes from (e.g., google, facebook, instagram)
- `utm_medium` - Marketing medium (e.g., cpc, paid_social, email)
- `utm_campaign` - Campaign name (e.g., luxury_properties, dubai_investors)

### Optional Parameters

- `utm_content` - Differentiate ads (e.g., banner_ad, text_ad)
- `utm_term` - Paid keywords (e.g., luxury_dubai_property)

## Platform-Specific Examples

### Google Ads
```
https://realestate.cliftonuae.com/?utm_source=google&utm_medium=cpc&utm_campaign=luxury_properties&utm_term=dubai_real_estate
```

### Facebook Ads
```
https://realestate.cliftonuae.com/?utm_source=facebook&utm_medium=paid_social&utm_campaign=dubai_investors&utm_content=carousel_ad
```

### Instagram Ads
```
https://realestate.cliftonuae.com/?utm_source=instagram&utm_medium=paid_social&utm_campaign=luxury_lifestyle&utm_content=story_ad
```

### LinkedIn Ads
```
https://realestate.cliftonuae.com/?utm_source=linkedin&utm_medium=paid_social&utm_campaign=business_investors
```

### Email Marketing
```
https://realestate.cliftonuae.com/?utm_source=newsletter&utm_medium=email&utm_campaign=monthly_properties
```

## Campaign Naming Conventions

Use lowercase with underscores for consistency:

✅ **Good:** `luxury_properties_q1_2026`  
❌ **Bad:** `Luxury Properties Q1 2026`

### Recommended Format
```
{objective}_{target_audience}_{time_period}

Examples:
- lead_generation_investors_q1_2026
- brand_awareness_expats_feb_2026
- property_showcase_luxury_buyers_2026
```

## Tracking in Google Analytics

All UTM parameters are automatically tracked by the Google Tag (AW-17933543375) on the landing page. You can view campaign performance in:

1. Google Ads dashboard
2. Google Analytics (if connected)
3. Vercel Analytics (basic traffic data)

## Best Practices

1. **Always test your URLs** before launching campaigns
2. **Use consistent naming** across all campaigns
3. **Document your campaigns** in a spreadsheet for reference
4. **Avoid special characters** in UTM parameters (use underscores instead of spaces)
5. **Keep campaign names descriptive** but concise

## URL Builder Tool

Use Google's Campaign URL Builder for easy UTM parameter generation:
https://ga-dev-tools.google/campaign-url-builder/

## Questions?

Contact the development team if you need:
- Custom tracking parameters
- Integration with additional analytics platforms
- Campaign performance reports
