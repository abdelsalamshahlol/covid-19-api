import {NowResponse} from "@now/node";

import {countries, iso3, aliases, countriesAr, nonISO} from "../../util/countries";
import {
    fetchFeatures,
    attributeSpreader,
    normalizeKeys,
    matchCountryCode,
    getIso3Code
} from "../../util/data";
import {getEndpoint} from "../../util/endpoints";
import {queryConfirmed} from "../../util/query";

export default async (_, res: NowResponse) => {
    const availableCountries = (
        await fetchFeatures(getEndpoint("countryRegion"), queryConfirmed())
    )
        .map(attributeSpreader)
        .map(normalizeKeys)
        .map(d => d.countryRegion)
        .map(countryRegion => {
            const iso2Country =
                countries[countryRegion] || aliases[countryRegion.toLowerCase()];
            const iso3Country = iso3[iso2Country];
            const nameArabic = countriesAr[iso2Country] || nonISO[countryRegion];
            return {
                name: countryRegion,
                iso2: iso2Country,
                iso3: iso3Country,
                name_ar: nameArabic
            };
        });
    availableCountries.sort((a, b) => (a.name < b.name ? -1 : 1));
    res.json({countries: availableCountries});
};
