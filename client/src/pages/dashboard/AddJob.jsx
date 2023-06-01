import { useEffect, useState } from "react";
import {
  useAppContext,
  useJobsContext,
  //   useMapContext,
} from "../../contextAPI/context";
import { useFetchJobsHook } from "../../hooks";
import {
  FormRow,
  FormRowSelect,
  FlashMessage,
  Loading,
} from "../../components";
import {
  jobTypeOptions,
  jobCategoryOptions,
  statusOptions,
} from "../../utils/jobOptions";

const AddJob = () => {
  const { createJob, updateJob } = useFetchJobsHook();

  // context
  const { isLoading, flash, setIsLoading, clearIsLoading, setFlash } =
    useAppContext();
  const {
    jobs,
    isEditMode,
    editJobId,
    setIsEditModeInContext,
    setEditJobIdInContext,
  } = useJobsContext();

  // const {
  //     setJobPopupInContext,
  //     setShowPopUpInContext,
  // } = useMapContext()

  const initJobState = {
    _id: "1",
    description: "",
    company: "",
    jobType: jobTypeOptions[0],
    jobCategory: jobCategoryOptions[0],
    status: statusOptions[0],
    location: {
      address: "",
      coordinates: [],
    },
  };

  // component level state
  const [formValues, setFormValues] = useState(initJobState);

  useEffect(() => {
    if (isEditMode && editJobId) {
      const job = jobs.find((job) => job._id === editJobId);
      if (!job) return;
      setFormValues(job);
    }
  }, [jobs, isEditMode, editJobId]);

  // clear form
  const handleClear = () => {
    setEditJobIdInContext(null);
    setIsEditModeInContext(false);
    // setShowPopUpInContext(false)
    setFormValues(initJobState);
  };

  // handle change - submit
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "address") {
      setFormValues((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          address: value,
        },
      }));
    } else {
      setFormValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { company, location } = formValues;

    if (company?.trim() === "") {
      return setFlash({
        type: "danger",
        message: "Company field can not be blank",
      });
    }

    if (location?.address?.trim() === "") {
      return setFlash({
        type: "danger",
        message: "Job address field can not be blank",
      });
    }

    try {
      setIsLoading();

      let updateObject = {};

      Object.keys(formValues)
        .filter((key) => key !== "location")
        .forEach((key) => {
          return (updateObject[key] = formValues[key]);
        });

      // => server-side mapBox geocoding only if address changed
      if (
        initJobState.location.address !== location.address &&
        location.address.trim() !== ""
      ) {
        updateObject = {
          ...updateObject,
          location: {
            ...formValues.location,
            address: location.address.trim(),
          },
        };
      }

      isEditMode
        ? await updateJob(updateObject)
        : await createJob(updateObject);

      clearIsLoading();
    } catch (error) {
      clearIsLoading();
    }
  };

  const submitBtnText = isEditMode ? "Update" : "Create";

  if (isLoading) return <Loading />;

  return (
    <div className="dashboard-form-page">
      {flash?.showFlash && <FlashMessage />}
      <form className="form" onSubmit={handleSubmit}>
        <h3>{isEditMode ? "Edit" : "Add"}</h3>
        <div className="form-center">
          <FormRow
            name="company"
            type="text"
            labelText="Company"
            value={formValues.company}
            handleChange={handleChange}
          />
          <FormRow
            name="description"
            type="text"
            labelText="Description"
            value={formValues.description}
            handleChange={handleChange}
          />
          <FormRow
            name="address"
            type="text"
            labelText="Address"
            value={formValues.location.address}
            handleChange={handleChange}
          />
          <FormRowSelect
            name="jobType"
            labelText="Type"
            options={jobTypeOptions}
            value={formValues.jobType}
            handleChange={handleChange}
          />
          <FormRowSelect
            name="jobCategory"
            labelText="Category"
            options={jobCategoryOptions}
            value={formValues.jobCategory}
            handleChange={handleChange}
          />
          <FormRowSelect
            name="status"
            labelText="Status"
            options={statusOptions}
            value={formValues.status}
            handleChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-block" disabled={isLoading}>
          {submitBtnText}
        </button>
        <button
          type="button"
          className="btn btn-block clear-btn"
          onClick={() => handleClear()}
          disabled={isLoading}
        >
          Clear values
        </button>
      </form>
    </div>
  );
};
export default AddJob;
