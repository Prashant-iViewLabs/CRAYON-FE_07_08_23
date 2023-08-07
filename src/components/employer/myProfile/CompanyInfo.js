import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import locale from "../../../i18n/locale";
import InputBox from "../../common/InputBox";
import { getIndustries } from "../../../redux/employer/empProfileSlice";
import { getCompanies } from "../../../redux/employer/empProfileSlice";
import { setAlert } from "../../../redux/configSlice";
import { ALERT_TYPE, ERROR_MSG } from "../../../utils/Constants";
import { useTheme } from "@emotion/react";
import AutoComplete from "../../common/AutoComplete";
import { setLoading } from "../../../redux/configSlice";
import { addId } from "../../../utils/Common";
import { isEmpty } from "lodash";

const PROFILE = {
  name: "",
  website: "",
  description: "",
  industry_ids: [],
};

// const WORD_LIMIT = 30;

export default function Info({
  handleCompanyInfoData,
  profile2,
  errors,
  companies,
  industries,
}) {
  const i18n = locale.en;
  const theme = useTheme();
  const dispatch = useDispatch();
  const [profileData, setProfileData] = useState(profile2);

  // const [wordLimitExceed, setWordLimitExceed] = useState(false);

  useEffect(() => {
    handleCompanyInfoData(profile2);
  }, []);
  useEffect(() => {
    if (!isEmpty(profile2)) {
      setProfileData(profile2);
    }
  }, [profile2]);

  const getIndValue = () => {
    if (profileData.industry_ids?.length == 0) {
      return [];
    }
    return profileData.industry_ids?.map(
      (industry) => industries?.find((ind) => ind.id == industry) || industry
    );
  };
  const getCompValue = () => {
    if (!profileData.name) {
      return;
    }
    return profileData.name;
  };

  const handleInputChange = (event) => {
    const newProfileData = {
      ...profileData,
      [event.target.id]: event.target.value,
    };
    setProfileData(newProfileData);
    handleCompanyInfoData(newProfileData);
  };

  const handleMultipleAutoComplete = (event, newValue, id) => {
    let newProfileData = {};
    newProfileData = {
      ...profileData,
      [id]: newValue.map((val) => val?.inputValue || val?.id || val),
    };
    setProfileData(newProfileData);
    handleCompanyInfoData(newProfileData);
  };
  const handleCompVal = (event, newValue, id) => {
    let newProfileData = {};
    newProfileData = {
      ...profileData,
      [id]: newValue?.inputValue || newValue?.company_id,
    };
    setProfileData(newProfileData);
    handleCompanyInfoData(newProfileData);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ width: "47%", mb: 3 }}>
          <Typography sx={{ ml: 2, marginBottom: "4px" }}>
            {i18n["empMyProfile.companyName"]}
          </Typography>
          {/* <InputBox placeholder={i18n['empMyProfile.companyNamePlace']} value={profileData.name} id='name' onChange={handleInputChange} /> */}
          <AutoComplete
            showAddOption={true}
            allowCustomInput={true}
            id="company_name"
            // value={getCompValue()}
            value={
              companies?.find(
                (title) => title.company_id == profileData?.company_name
              ) || profileData?.company_name
            }
            onChange={handleCompVal}
            placeholder={i18n["empMyProfile.companyNamePlace"]}
            data={companies}
          ></AutoComplete>
          {!companies?.find(
            (title) => title.company_id == profileData?.company_name
          ) &&
            !profileData?.company_name &&
            errors?.find((error) => error.key == "company_name") && (
              <Typography color={"red !important"}>
                {`*${
                  errors?.find((error) => error.key == "company_name").message
                }`}
              </Typography>
            )}
        </Box>
        <Box sx={{ width: "47%" }}>
          <Typography sx={{ ml: 2, marginBottom: "4px" }}>
            {i18n["empMyProfile.companyWebsite"]}
          </Typography>
          <InputBox
            placeholder={i18n["empMyProfile.companyWebsitePlace"]}
            value={profileData.hyperlink}
            id="hyperlink"
            onChange={handleInputChange}
          />
          {profileData.hyperlink == "" &&
            errors?.find((error) => error.key == "hyperlink") && (
              <Typography color={"red !important"}>
                {`*${
                  errors?.find((error) => error.key == "hyperlink").message
                }`}
              </Typography>
            )}
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ width: "47%", mb: 3 }}>
          <Typography sx={{ ml: 2, marginBottom: "4px" }}>
            {i18n["empMyProfile.companyIndustry"]}
          </Typography>
          <AutoComplete
            multiple={true}
            id="industry_ids"
            value={getIndValue()}
            onChange={handleMultipleAutoComplete}
            sx={{ width: "100%", display: "inline-table" }}
            placeholder={i18n["myCV.preferredIndustries"]}
            data={industries}
            allowCustomInput={false}
          ></AutoComplete>
          {getIndValue() == "" &&
            errors?.find((error) => error.key == "industry_ids") && (
              <Typography color={"red !important"}>
                {`*${
                  errors?.find((error) => error.key == "industry_ids").message
                }`}
              </Typography>
            )}
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ width: "100%" }}>
          <Typography sx={{ ml: 2, marginBottom: "4px" }}>
            {i18n["empMyProfile.companyDescription"]}
          </Typography>
          <InputBox
            multiline={true}
            sx={{ height: "135px" }}
            placeholder={i18n["empMyProfile.companyDescriptionPlace"]}
            value={profileData.notes}
            id="notes"
            onChange={handleInputChange}
          />
          {profileData.notes == "" &&
            errors?.find((error) => error.key == "notes") && (
              <Typography color={"red !important"}>
                {`*${errors?.find((error) => error.key == "notes").message}`}
              </Typography>
            )}
        </Box>
      </Box>
    </Box>
  );
}
