export interface RequestBody {
  level: "company" | string;
  company: string;
  year: string;
  ipo: string;
  unit: string;
  profile: string;
  search: string;
  limit: number;
}

export interface CompanyDataState {
  loading: boolean;
  error: string | null;
  data: any; // You can replace this with a more specific type if you know the response shape

    profileLoading: boolean;
  profileError: string | null;
  profileData: any;
}

export interface CompanyItem {
  name: string;
  type: string;
  drawings: number;
  last_ts: string;
}



export interface ProfileRequestBody {
  ipo: string;
  unit: string;
  profile: string;
}
