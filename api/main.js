let API_URL = "https://anasnajaa-api.herokuapp.com/api/v1";
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  API_URL = "http://localhost:5000/api/v1";
}
const ERRMSG = `Data retrival failed for endpoint:`;

export const submitServiceRequest = async (serviceRequestObject) => {
  const response = await fetch(`${API_URL}/requests/service`, {
    method: "POST",
    body: serviceRequestObject,
  });
  if (response.ok) {
    return await response.json();
  } else {
    throw Error(`${ERRMSG} submitServiceRequest`);
  }
};

export const getBooks = async () => {
  const response = await fetch(`${API_URL}/books`, { method: "GET" });
  if (response.ok) {
    return await response.json();
  } else {
    throw Error(`${ERRMSG} getBooks`);
  }
};

export const getLinks = async () => {
  const response = await fetch(`${API_URL}/links`, { method: "GET" });
  if (response.ok) {
    return await response.json();
  } else {
    throw Error(`${ERRMSG} getLinks`);
  }
};

export const getCovidCasesByCountry = async (query) => {
  const response = await fetch(
    `https://disease.sh/v3/covid-19/countries?` + new URLSearchParams(query),
    {
      method: "GET",
    }
  );
  if (response.ok) {
    return await response.json();
  } else {
    throw Error(`${ERRMSG} getCovidCasesByCountry`);
  }
};
