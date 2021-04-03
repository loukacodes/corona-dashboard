export interface SingleCountryData {
  ID:          string;
  Country:     Country;
  CountryCode: CountryCode;
  Province:    string;
  City:        string;
  CityCode:    string;
  Lat:         string;
  Lon:         string;
  Confirmed:   number;
  Deaths:      number;
  Recovered:   number;
  Active:      number;
  Date:        Date;
}

export enum Country {
  VietNam = "Viet Nam",
}

export enum CountryCode {
  Vn = "VN",
}
