
import R from 'ramda';
import xhr from 'xhr';

import constants from '../constants';

export default {
  fetch: ({theme, year, type, typeId}) => {
    return new Promise((resolve, reject) => {
      if (!theme || !type || !year) {
        reject(new Error('Missing required parameters'));
      }

      let uri = `//${constants.API_BASE}/${theme}/${type}/`;
      if (typeId) { uri += typeId; }

      xhr({
        json: true,
        uri: uri
      }, (err, res, body) => {
        if (err) {
          reject(err);
        }
        else {
          // TODO: Make filter by year part of API instead
          const themeKey = constants.THEME_KEYS[theme];
          const yearThemeKey = themeKey + year;
          const omitList = constants.DECADES.map((d) => themeKey + d);

          const dataForYear = body.filter(R.has(yearThemeKey))
            .map((row) => {
              const obj = R.omit(omitList, row);
              obj.Value = row[yearThemeKey];
              return obj;
            });

          resolve(dataForYear);
        }
      });
    });
  }
};