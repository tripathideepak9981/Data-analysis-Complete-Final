import axios from 'axios'
import Swal from 'sweetalert2';

const API_BASE_URL = "http://127.0.0.1:8000";

const axiosConfig = {
  timeout: 20000,
}

const handleError = (error, action = "processing-request") => {
  console.error(`Error ${action}:`, error.response?.data || error.message);
  let errorMessage = "Something went wrong";
  if(error.code === "ECONNABORTED"){
    errorMessage = "Network issue. Try again later.";
  }else if(error.response?.data?.detail){
    errorMessage = error.response?.data?.detail;
  }
  Swal.fire({
    icon: "error",
    title: "Error",
    text: errorMessage,
    confirmButtonText: "OK",
  });
  return {success: false, error: error.message};
}

export const uploadFilesAPI = async (selectedFiles) => {
  if (!selectedFiles.length) return;

  const formData = new FormData();
  selectedFiles.forEach((file) => {
    formData.append("files", file);
  });

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/upload/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        ...axiosConfig,
      }
    );
    console.log("Files uploaded successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error uploading files:", error);
    return handleError(error, "uploading files")
  }
};

export const exceuteQuery = async (query) => {
  try {
    const token = localStorage.getItem("access_token");
    console.log("Query:", query);
    console.log("Token:", token);

    const response = await axios.post(`${API_BASE_URL}/api/execute_query/`,
      { "query": query },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      }
    );

    console.log("Query executed successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error executing query:", error);
    return handleError(error, "execute query");
  }
}


export const chartGenerator = async (query) => {
  try {
    console.log("Query : " + query)
    const response = await axios.post(`${API_BASE_URL}/chart/chart/`, {query }, {
      headers: {
        "Content-Type": "application/json"
      },
      ...axiosConfig,
    });
    console.log("Chart generated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error generating chart:", error.response?.data || error.message);
    // return handleError(error, "chart generation");
  }
}

export const cleanFile = async (table_name) => {
  const token = localStorage.getItem("access_token");
  console.log("Access token: " + token)
   try{
       console.log("Table Name : " + table_name)
       const response = await axios.post(`${API_BASE_URL}/api/clean_file?table_name=${encodeURIComponent(table_name)}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
       });
       console.log("File cleaned successfully:", response.data);
       return response.data;
   }catch (error) {
       console.error("Error cleaning file:", error.response?.data || error.message);
       return handleError(error, "cleaning file");
   }
} 

export const cancel_clean_file = async (table_name) => {
  const token = localStorage.getItem("access_token");
  console.log("Access token: " + token)

   try{
      console.log("Table name:", table_name);
      const response = await axios.post( `${API_BASE_URL}/api/cancel_clean?table_name=${encodeURIComponent(table_name)}`, {},  {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
       }
      );
      console.log("Cancel clean file response:", response.data);
      return response.data;
   }catch(error){
     console.error("Error cancelling clean file:", error);
     return handleError(error, "cancelling clean file");
   }
}


export const connectToDatabase = async (dbParams) => {
   try{
      const response = await axios.post(`${API_BASE_URL}/api/connect_db`, dbParams, axiosConfig);
      console.log("Database connection response:", response.data);
      return response.data;
   }catch (error){
     console.error("Error connecting to database:", error);
     return handleError(error, "connecting to database");;
   }
}


export const loadTablesApi = async (table_name) => {
  try{
    console.log("Loading Tables : "+ table_name);
    const response = await axios.post(`${API_BASE_URL}/api/load_tables`, table_name, {
      headers: {
        "Content-Type": "application/json"
      },
      ...axiosConfig
    })
    console.log("Tables loaded successfully:", response.data);
    return response.data;
  }catch (error) {
    console.error("Error loading tables:", error.response?.data || error.message);
    return handleError(error, "loading tables");
  }
}

export const sendSignUpData = async(formData) => {
  try{
    console.log("sending sign up data", formData) 
    const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, formData, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    console.log("Sending sign up data successfully:", response.data)
    const {access_token} = response.data;
    localStorage.setItem("access_token", access_token)
    console.log(formData.username)
    localStorage.setItem("username", formData.username)
    return response.data;
  }catch (error){
    console.error("Error sending sign up data:", error.response)
    return handleError(error, "Error Uploading Sign Up Data");
  }
} 
export const sendSignInData = async (username, password) => {
  try {
    console.log("Signing in:", username, password);
    const response = await axios.post(
      `${API_BASE_URL}/api/auth/login`,
      new URLSearchParams({
        username,
        password,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log(response.data);

    const { access_token } = response.data;
    console.log(access_token);

    localStorage.setItem("access_token", access_token);
    localStorage.setItem("username", username);
    console.log("access_token is stored : ", localStorage.getItem("access_token"))

    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data?.detail || error.message);
    throw error;
  }
};


export const logoutUser = async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("access_token")
  localStorage.removeItem("token_type");
  localStorage.removeItem("userEmail");
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/auth/logout`, 
      {},
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`
        }
      }
    );

    if (response.status === 200) {
      console.log(response.data.detail); 
      window.location.href = '/';
    }
  } catch (error) {
    console.error('Logout failed:', error.response?.data || error.message);
  }
}