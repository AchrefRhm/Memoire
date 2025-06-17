// client/src/app/create/page.js (or edit/[id]/page.js - same component with minor adjustments)
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import Modal from "react-modal";
import PremiumFeatureModal from "@/components/PremiumFeatureModal";

function CreateCV({ params }) {
  const router = useRouter();
  const isEditMode = params?.id;
  const { user } = useAuth();
  const userId = user?._id; // In a real app, this would come from authentication
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [generatingExperience, setGeneratingExperience] = useState(false);
  const [AiExpreriencePrompt, setAiExpreriencePrompt] = useState("");
  const [activeSection, setActiveSection] = useState("personalInfo");
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeInfo, setUpgradeInfo] = useState(null);
  const handleOpen = () => {
    if (user?.subs == "ultimate") {
      setOpen(!open);
    } else {
      setShowPremiumModal(true);
    }
  };
  const handleCloseModal = () => {
    setShowPremiumModal(false);
  };
  const onRequestClose = () => setOpen(false);
  const [formData, setFormData] = useState({
    name: "My CV",
    titleColor: "#000000",
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      location: "",
      title: "",
      website: "",
      linkedin: "",
    },
    summary: {
      content: "",
    },
    experience: [
      {
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    education: [
      {
        institution: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    skills: [
      {
        name: "",
        level: "Intermediate",
      },
    ],
    aiGeneratedSummary: "",
  });

  // Fetch CV data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchCV = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`/api/cv/detail/${params.id}`);
          setFormData(response.data);
        } catch (error) {
          console.error("Error fetching CV:", error);
          alert("Failed to load CV data.");
        } finally {
          setLoading(false);
        }
      };

      fetchCV();
    }
  }, [isEditMode, params?.id]);

  const handleInputChange = (section, index, field, value) => {
    if (section === "personalInfo") {
      setFormData({
        ...formData,
        personalInfo: {
          ...formData.personalInfo,
          [field]: value,
        },
      });
    } else if (section === "summary") {
      setFormData({
        ...formData,
        summary: {
          ...formData.summary,
          [field]: value,
        },
      });
    } else {
      const updatedItems = [...formData[section]];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      };

      setFormData({
        ...formData,
        [section]: updatedItems,
      });
    }
  };

  const addItem = (section) => {
    const newItem =
      section === "experience"
        ? {
            title: "",
            company: "",
            location: "",
            startDate: "",
            endDate: "",
            description: "",
            color: "#000000",
          }
        : section === "education"
          ? {
              institution: "",
              degree: "",
              field: "",
              startDate: "",
              endDate: "",
              description: "",
              color: "#000000",
            }
          : {
              name: "",
              level: "Intermediate",
              color: "#000000",
            };

    setFormData({
      ...formData,
      [section]: [...formData[section], newItem],
    });
  };

  const removeItem = (section, index) => {
    const updatedItems = [...formData[section]];
    updatedItems.splice(index, 1);

    setFormData({
      ...formData,
      [section]: updatedItems,
    });
  };

  const generateAISummary = async () => {
    if (user?.subs != "ultimate") {
      setShowPremiumModal(true);
      return;
    }
    try {
      setGeneratingSummary(true);
      const response = await axios.post(`/api/cv/generate-summary`, {
        personalInfo: formData.personalInfo,
        experience: formData.experience,
        education: formData.education,
        skills: formData.skills,
      });

      setFormData({
        ...formData,
        summary: {
          ...formData.summary,
          content: response.data.summary,
        },
        aiGeneratedSummary: response.data.summary,
      });
    } catch (error) {
      console.error("Error generating AI summary:", error);
      alert("Failed to generate AI summary. Please try again.");
    } finally {
      setGeneratingSummary(false);
    }
  };

  const generateAIExperience = async () => {
    try {
      setGeneratingExperience(true);
      const response = await axios.post(`/api/cv/generate-experience`, {
        prompt: AiExpreriencePrompt,
      });

      // Extract the JSON string from the response (removing markdown code formatting)
      let jsonString = response.data.summary;

      // Remove markdown code blocks if present
      if (jsonString.includes("```json")) {
        jsonString = jsonString
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();
      }

      // Parse the JSON
      const aiExperience = JSON.parse(jsonString);

      // Get the current experience array
      const currentExperience = [...formData.experience];

      // Find the first empty experience or create a new one at the end
      const emptyIndex = currentExperience.findIndex(
        (exp) => !exp.title && !exp.company && !exp.description,
      );

      const targetIndex =
        emptyIndex !== -1 ? emptyIndex : currentExperience.length;

      // If we need to add a new experience
      if (targetIndex === currentExperience.length) {
        currentExperience.push({
          title: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          description: "",
        });
      }

      // Update the experience with AI-generated data
      currentExperience[targetIndex] = {
        ...currentExperience[targetIndex],
        title: aiExperience.title || "",
        company: aiExperience.company || "",
        location: aiExperience.location || "",
        startDate: aiExperience.startDate || "",
        endDate: aiExperience.endDate || "",
        description: aiExperience.description || "",
      };

      setFormData({
        ...formData,
        experience: currentExperience,
      });

      // Close the modal after successful generation
      setOpen(false);
      setAiExpreriencePrompt(""); // Clear the prompt
    } catch (error) {
      console.error("Error generating AI experience:", error);
      alert("Failed to generate AI experience. Please try again.");
    } finally {
      setGeneratingExperience(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      const requestData = {
        ...formData,
        userId: userId,
      };

      let response;

      if (isEditMode) {
        response = await axios.put(`/api/cv/${params.id}`, requestData);
        alert("CV updated successfully!");
      } else {
        response = await axios.post(`/api/cv/create`, requestData);
        router.push(`/cv/preview/${response.data._id}`);
      }
    } catch (error) {
      if (error.response?.data?.upgradeRequired) {
        setUpgradeInfo(error.response.data);
        setShowUpgradeModal(true);
      } else {
        console.error(
          error.response?.data?.message || "Error generating interview",
        );
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading CV data...</p>
      </div>
    );
  }

  // CV Preview Component - Updated to only color titles
  const CVPreview = () => (
    <div className="h-full overflow-y-scroll rounded-lg bg-white shadow-lg">
      <PremiumFeatureModal
        isOpen={showPremiumModal}
        onClose={() => handleCloseModal()}
        featureName="Ultimate Feature"
        featureDescription="Upgrade to Ultimate to unlock this Ai feeature"
        ctaText="Upgrade to Ultimate"
        planType="ultimate"
      />
      <div className="p-8">
        {/* Personal Info */}
        <div className="mb-8 border-b pb-6">
          <h1
            className="mb-2 text-3xl font-bold"
            style={{ color: formData.titleColor }}
          >
            {formData.personalInfo.name || "Your Name"}
          </h1>
          {formData.personalInfo.title && (
            <h2 className="mb-4 text-xl text-gray-700">
              {formData.personalInfo.title}
            </h2>
          )}

          <div className="flex flex-wrap gap-x-4 gap-y-2 text-gray-600">
            {formData.personalInfo.email && (
              <div>Email: {formData.personalInfo.email}</div>
            )}
            {formData.personalInfo.phone && (
              <div>Phone: {formData.personalInfo.phone}</div>
            )}
            {formData.personalInfo.location && (
              <div>Location: {formData.personalInfo.location}</div>
            )}
            {formData.personalInfo.website && (
              <div>Website: {formData.personalInfo.website}</div>
            )}
          </div>
        </div>

        {/* Summary */}
        {formData.summary.content && (
          <div className="mb-8">
            <h2
              className="mb-3 border-b pb-2 text-2xl font-bold"
              style={{
                color: formData.titleColor,
                borderColor: formData.titleColor,
              }}
            >
              Professional Summary
            </h2>
            <p className="text-gray-700">{formData.summary.content}</p>
          </div>
        )}

        {/* Experience */}
        {formData.experience.length > 0 &&
          formData.experience.some((exp) => exp.title) && (
            <div className="mb-8">
              <h2
                className="mb-3 border-b pb-2 text-2xl font-bold"
                style={{
                  color: formData.titleColor,
                  borderColor: formData.titleColor,
                }}
              >
                Work Experience
              </h2>

              {formData.experience.map(
                (exp, index) =>
                  exp.title && (
                    <div key={index} className="mb-6">
                      <div className="flex items-start justify-between">
                        <h3 className="text-xl font-semibold">{exp.title}</h3>
                        <div className="text-gray-600">
                          {exp.startDate} - {exp.endDate || "Present"}
                        </div>
                      </div>

                      <div className="mb-2">
                        <span className="font-medium">{exp.company}</span>
                        {exp.location && (
                          <span className="text-gray-600">
                            {" "}
                            • {exp.location}
                          </span>
                        )}
                      </div>

                      {exp.description && (
                        <p className="text-gray-700">{exp.description}</p>
                      )}
                    </div>
                  ),
              )}
            </div>
          )}

        {/* Education */}
        {formData.education.length > 0 &&
          formData.education.some((edu) => edu.institution) && (
            <div className="mb-8">
              <h2
                className="mb-3 border-b pb-2 text-2xl font-bold"
                style={{
                  color: formData.titleColor,
                  borderColor: formData.titleColor,
                }}
              >
                Education
              </h2>

              {formData.education.map(
                (edu, index) =>
                  edu.institution && (
                    <div key={index} className="mb-6">
                      <div className="flex items-start justify-between">
                        <h3 className="text-xl font-semibold">
                          {edu.institution}
                        </h3>
                        <div className="text-gray-600">
                          {edu.startDate} - {edu.endDate || "Present"}
                        </div>
                      </div>

                      {(edu.degree || edu.field) && (
                        <div className="mb-2">
                          <span className="font-medium">
                            {edu.degree}
                            {edu.field && edu.degree ? " in " : ""}
                            {edu.field}
                          </span>
                        </div>
                      )}

                      {edu.description && (
                        <p className="text-gray-700">{edu.description}</p>
                      )}
                    </div>
                  ),
              )}
            </div>
          )}

        {/* Skills */}
        {formData.skills.length > 0 &&
          formData.skills.some((skill) => skill.name) && (
            <div>
              <h2
                className="mb-3 border-b pb-2 text-2xl font-bold"
                style={{
                  color: formData.titleColor,
                  borderColor: formData.titleColor,
                }}
              >
                Skills
              </h2>

              <div className="flex flex-wrap gap-2">
                {formData.skills.map(
                  (skill, index) =>
                    skill.name && (
                      <div
                        key={index}
                        className="rounded-full border border-gray-300 px-3 py-1"
                      >
                        {skill.name} {skill.level && `(${skill.level})`}
                      </div>
                    ),
                )}
              </div>
            </div>
          )}
      </div>
    </div>
  );
  const closeUpgradeModal = () => {
    setShowUpgradeModal(false);
  };
  return (
    <div className="min-h-screen">
      <PremiumFeatureModal
        isOpen={showUpgradeModal}
        onClose={() => closeUpgradeModal()}
        featureName={
          upgradeInfo?.recommendedPlan == "premium"
            ? "Premium Features"
            : "Ultimate Features"
        }
        featureDescription={upgradeInfo?.message}
        ctaText="Upgrade Now"
        planType={upgradeInfo?.recommendedPlan}
      />
      {/* Header */}
      <header className="bg-gray-800 p-4 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">
              {isEditMode ? `Editing: ${formData.name}` : "Create New CV"}
            </h1>
          </div>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => router.push("/cv")}
              className="rounded-md border border-gray-500 px-4 py-2 hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:bg-blue-400"
            >
              {saving ? "Saving..." : isEditMode ? "Save Changes" : "Create CV"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Split View */}
      <div className="flex h-[calc(100vh-64px)] flex-col lg:flex-row">
        {/* Left Panel - Form Editor */}
        <div className="w-full overflow-y-auto bg-gray-50 p-6 lg:w-1/2">
          <div className="mx-auto max-w-2xl">
            {/* Tabs for sections */}
            <div className="mb-6 flex space-x-2 overflow-x-auto pb-2">
              <button
                onClick={() => setActiveSection("personalInfo")}
                className={`whitespace-nowrap rounded-md px-4 py-2 ${
                  activeSection === "personalInfo"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Personal Info
              </button>

              <button
                onClick={() => setActiveSection("experience")}
                className={`whitespace-nowrap rounded-md px-4 py-2 ${
                  activeSection === "experience"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Experience
              </button>
              <button
                onClick={() => setActiveSection("education")}
                className={`whitespace-nowrap rounded-md px-4 py-2 ${
                  activeSection === "education"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Education
              </button>
              <button
                onClick={() => setActiveSection("skills")}
                className={`whitespace-nowrap rounded-md px-4 py-2 ${
                  activeSection === "skills"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Skills
              </button>
              <button
                onClick={() => setActiveSection("summary")}
                className={`whitespace-nowrap rounded-md px-4 py-2 ${
                  activeSection === "summary"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Summary
              </button>
            </div>
            <div className="mb-4 flex items-center gap-2">
              <label className="block text-sm font-medium">
                Section Title Color:
              </label>
              <input
                type="color"
                value={formData.titleColor}
                onChange={(e) =>
                  setFormData({ ...formData, titleColor: e.target.value })
                }
                className="h-8 w-8 cursor-pointer rounded-md"
              />
            </div>
            {/* Form controls - only show active section */}
            <div>
              {/* CV Name always visible */}
              <div className="mb-6">
                <label className="mb-1 block text-sm font-medium">
                  CV Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-md border p-2"
                  required
                />
              </div>

              {/* Personal Information */}
              {activeSection === "personalInfo" && (
                <div>
                  <h2 className="mb-4 text-xl font-semibold">
                    Personal Information
                  </h2>
                  {/* Add this color picker */}

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.personalInfo.name}
                        onChange={(e) =>
                          handleInputChange(
                            "personalInfo",
                            null,
                            "name",
                            e.target.value,
                          )
                        }
                        className="w-full rounded-md border p-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        Professional Title
                      </label>
                      <input
                        type="text"
                        value={formData.personalInfo.title}
                        onChange={(e) =>
                          handleInputChange(
                            "personalInfo",
                            null,
                            "title",
                            e.target.value,
                          )
                        }
                        className="w-full rounded-md border p-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.personalInfo.email}
                        onChange={(e) =>
                          handleInputChange(
                            "personalInfo",
                            null,
                            "email",
                            e.target.value,
                          )
                        }
                        className="w-full rounded-md border p-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.personalInfo.phone}
                        onChange={(e) =>
                          handleInputChange(
                            "personalInfo",
                            null,
                            "phone",
                            e.target.value,
                          )
                        }
                        className="w-full rounded-md border p-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.personalInfo.location}
                        onChange={(e) =>
                          handleInputChange(
                            "personalInfo",
                            null,
                            "location",
                            e.target.value,
                          )
                        }
                        className="w-full rounded-md border p-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        Website
                      </label>
                      <input
                        type="url"
                        value={formData.personalInfo.website}
                        onChange={(e) =>
                          handleInputChange(
                            "personalInfo",
                            null,
                            "website",
                            e.target.value,
                          )
                        }
                        className="w-full rounded-md border p-2"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Experience Section */}
              {activeSection === "experience" && (
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Work Experience</h2>
                    <button
                      type="button"
                      onClick={() => addItem("experience")}
                      className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                    >
                      Add Experience
                    </button>
                  </div>

                  {formData.experience.map((exp, index) => (
                    <div key={index} className="mb-4 rounded-md border p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="font-medium">Experience #{index + 1}</h3>
                        <div className="flex items-center">
                          <button
                            type="button"
                            onClick={() => removeItem("experience", index)}
                            className="text-red-600 hover:text-red-800"
                            disabled={formData.experience.length === 1}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="mb-2 flex justify-center">
                        <button
                          type="button"
                          onClick={handleOpen}
                          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-normal text-black hover:bg-gray-200"
                        >
                          {generatingSummary ? (
                            "Generating..."
                          ) : (
                            <span className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                                className="mr-2 h-4 w-4 fill-black"
                              >
                                <path d="M224 96l16-32 32-16-32-16-16-32-16 32-32 16 32 16 16 32zM80 160l26.7-53.3L160 80l-53.3-26.7L80 0 53.3 53.3 0 80l53.3 26.7L80 160zm352 128l-26.7 53.3L352 368l53.3 26.7L432 448l26.7-53.3L512 368l-53.3-26.7L432 288zm70.6-193.8L417.8 9.4C411.5 3.1 403.3 0 395.2 0c-8.2 0-16.4 3.1-22.6 9.4L9.4 372.5c-12.5 12.5-12.5 32.8 0 45.3l84.9 84.9c6.3 6.3 14.4 9.4 22.6 9.4 8.2 0 16.4-3.1 22.6-9.4l363.1-363.2c12.5-12.5 12.5-32.8 0-45.2zM359.5 203.5l-50.9-50.9 86.6-86.6 50.9 50.9-86.6 86.6z" />
                              </svg>{" "}
                              <span className="">Smart fill with AI</span>
                            </span>
                          )}
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm font-medium">
                            Job Title
                          </label>
                          <input
                            type="text"
                            value={exp.title}
                            onChange={(e) =>
                              handleInputChange(
                                "experience",
                                index,
                                "title",
                                e.target.value,
                              )
                            }
                            className="w-full rounded-md border p-2"
                            style={{ color: exp.color }}
                            required
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium">
                            Company
                          </label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) =>
                              handleInputChange(
                                "experience",
                                index,
                                "company",
                                e.target.value,
                              )
                            }
                            className="w-full rounded-md border p-2"
                            style={{ color: exp.color }}
                            required
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium">
                            Location
                          </label>
                          <input
                            type="text"
                            value={exp.location}
                            onChange={(e) =>
                              handleInputChange(
                                "experience",
                                index,
                                "location",
                                e.target.value,
                              )
                            }
                            className="w-full rounded-md border p-2"
                            style={{ color: exp.color }}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="mb-1 block text-sm font-medium">
                              Start Date
                            </label>
                            <input
                              type="text"
                              value={exp.startDate}
                              onChange={(e) =>
                                handleInputChange(
                                  "experience",
                                  index,
                                  "startDate",
                                  e.target.value,
                                )
                              }
                              className="w-full rounded-md border p-2"
                              style={{ color: exp.color }}
                              placeholder="MM/YYYY"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-sm font-medium">
                              End Date
                            </label>
                            <input
                              type="text"
                              value={exp.endDate}
                              onChange={(e) =>
                                handleInputChange(
                                  "experience",
                                  index,
                                  "endDate",
                                  e.target.value,
                                )
                              }
                              className="w-full rounded-md border p-2"
                              style={{ color: exp.color }}
                              placeholder="MM/YYYY or Present"
                            />
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <label className="mb-1 block text-sm font-medium">
                            Description
                          </label>
                          <textarea
                            value={exp.description}
                            onChange={(e) =>
                              handleInputChange(
                                "experience",
                                index,
                                "description",
                                e.target.value,
                              )
                            }
                            className="h-24 w-full rounded-md border p-2"
                            style={{ color: exp.color }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Education */}
              {activeSection === "education" && (
                <div className="border-t pt-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Education</h2>
                    <button
                      type="button"
                      onClick={() => addItem("education")}
                      className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                    >
                      Add Education
                    </button>
                  </div>

                  {formData.education.map((edu, index) => (
                    <div key={index} className="mb-4 rounded-md border p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="font-medium">Education #{index + 1}</h3>
                        <div className="flex items-center">
                          <button
                            type="button"
                            onClick={() => removeItem("education", index)}
                            className="text-red-600 hover:text-red-800"
                            disabled={formData.education.length === 1}
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm font-medium">
                            Institution
                          </label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) =>
                              handleInputChange(
                                "education",
                                index,
                                "institution",
                                e.target.value,
                              )
                            }
                            className="w-full rounded-md border p-2"
                            style={{ color: edu.color }}
                            required
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium">
                            Degree
                          </label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) =>
                              handleInputChange(
                                "education",
                                index,
                                "degree",
                                e.target.value,
                              )
                            }
                            className="w-full rounded-md border p-2"
                            style={{ color: edu.color }}
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium">
                            Field of Study
                          </label>
                          <input
                            type="text"
                            value={edu.field}
                            onChange={(e) =>
                              handleInputChange(
                                "education",
                                index,
                                "field",
                                e.target.value,
                              )
                            }
                            className="w-full rounded-md border p-2"
                            style={{ color: edu.color }}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="mb-1 block text-sm font-medium">
                              Start Date
                            </label>
                            <input
                              type="text"
                              value={edu.startDate}
                              onChange={(e) =>
                                handleInputChange(
                                  "education",
                                  index,
                                  "startDate",
                                  e.target.value,
                                )
                              }
                              className="w-full rounded-md border p-2"
                              style={{ color: edu.color }}
                              placeholder="MM/YYYY"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-sm font-medium">
                              End Date
                            </label>
                            <input
                              type="text"
                              value={edu.endDate}
                              onChange={(e) =>
                                handleInputChange(
                                  "education",
                                  index,
                                  "endDate",
                                  e.target.value,
                                )
                              }
                              className="w-full rounded-md border p-2"
                              style={{ color: edu.color }}
                              placeholder="MM/YYYY or Present"
                            />
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <label className="mb-1 block text-sm font-medium">
                            Description
                          </label>
                          <textarea
                            value={edu.description}
                            onChange={(e) =>
                              handleInputChange(
                                "education",
                                index,
                                "description",
                                e.target.value,
                              )
                            }
                            className="h-24 w-full rounded-md border p-2"
                            style={{ color: edu.color }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Skills */}
              {activeSection === "skills" && (
                <div className="border-t pt-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Skills</h2>
                    <button
                      type="button"
                      onClick={() => addItem("skills")}
                      className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                    >
                      Add Skill
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {formData.skills.map((skill, index) => (
                      <div key={index} className="rounded-md border p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center"></div>
                          <button
                            type="button"
                            onClick={() => removeItem("skills", index)}
                            className="text-sm text-red-600 hover:text-red-800"
                            disabled={formData.skills.length === 1}
                          >
                            Remove
                          </button>
                        </div>

                        <div>
                          <label className="mb-1 block text-sm font-medium">
                            Skill Name
                          </label>
                          <input
                            type="text"
                            value={skill.name}
                            onChange={(e) =>
                              handleInputChange(
                                "skills",
                                index,
                                "name",
                                e.target.value,
                              )
                            }
                            className="w-full rounded-md border p-2"
                            style={{ color: skill.color }}
                            required
                          />
                        </div>
                        <div className="mt-2">
                          <label className="mb-1 block text-sm font-medium">
                            Level
                          </label>
                          <select
                            value={skill.level}
                            onChange={(e) =>
                              handleInputChange(
                                "skills",
                                index,
                                "level",
                                e.target.value,
                              )
                            }
                            className="w-full rounded-md border p-2"
                            style={{ color: skill.color }}
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Expert">Expert</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary */}
              {activeSection === "summary" && (
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                      Professional Summary
                    </h2>
                    <button
                      type="button"
                      onClick={generateAISummary}
                      disabled={generatingSummary}
                      className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:bg-purple-400"
                    >
                      {generatingSummary ? (
                        "Generating..."
                      ) : (
                        <span className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                            className="mr-2 h-5 w-5 fill-white"
                          >
                            <path d="M224 96l16-32 32-16-32-16-16-32-16 32-32 16 32 16 16 32zM80 160l26.7-53.3L160 80l-53.3-26.7L80 0 53.3 53.3 0 80l53.3 26.7L80 160zm352 128l-26.7 53.3L352 368l53.3 26.7L432 448l26.7-53.3L512 368l-53.3-26.7L432 288zm70.6-193.8L417.8 9.4C411.5 3.1 403.3 0 395.2 0c-8.2 0-16.4 3.1-22.6 9.4L9.4 372.5c-12.5 12.5-12.5 32.8 0 45.3l84.9 84.9c6.3 6.3 14.4 9.4 22.6 9.4 8.2 0 16.4-3.1 22.6-9.4l363.1-363.2c12.5-12.5 12.5-32.8 0-45.2zM359.5 203.5l-50.9-50.9 86.6-86.6 50.9 50.9-86.6 86.6z" />
                          </svg>{" "}
                          <span className="font-bold">Generate with AI</span>
                        </span>
                      )}
                    </button>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center gap-4">
                      <label className="block flex-shrink-0 text-sm font-medium">
                        Summary Content
                      </label>
                    </div>
                    <textarea
                      value={formData.summary.content}
                      onChange={(e) =>
                        handleInputChange(
                          "summary",
                          null,
                          "content",
                          e.target.value,
                        )
                      }
                      className="h-40 w-full rounded-md border p-2"
                      placeholder="Write a professional summary or use AI to generate one"
                      style={{ color: formData.summary.color }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - CV Preview */}
        <div className="w-full overflow-y-scroll bg-white p-6 lg:w-1/2 ">
          {/* Preview content would go here */}
          <CVPreview />
        </div>
      </div>
      <Modal
        isOpen={open}
        onRequestClose={onRequestClose}
        contentLabel="Order Modal"
        className="fixed left-1/2 top-1/2 z-50 w-[90%] max-w-[500px] -translate-x-1/2 -translate-y-1/2 transform rounded-md bg-white px-4 py-1 shadow-xl outline-none dark:bg-[#1A222C] "
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <button
          onClick={onRequestClose}
          className="absolute right-3 top-1 z-10 text-black dark:text-white"
        >
          x
        </button>
        <div className="p-4">
          <h3 className="font-bold text-black">Generate work experience</h3>
          <p className="text-sm  text-gray-400">
            Describe this work experience and the AI will generate an opimized
            entry for you
          </p>
          <div className="mt-4 flex flex-col">
            <label
              htmlFor="story"
              className="mb-2 text-sm font-bold text-black"
            >
              Description:
            </label>

            <textarea
              name="story"
              rows={3}
              className="rounded-md border border-black px-4 py-2 placeholder:text-sm"
              placeholder="E-g. from nov 2019 to dec 2020 | worked at google as software
engineer, my tasks were: ..."
              value={AiExpreriencePrompt}
              onChange={(e) => setAiExpreriencePrompt(e.target.value)}
            />
            <button
              onClick={generateAIExperience}
              disabled={generatingExperience}
              className="mt-3 flex w-fit justify-start rounded-md bg-black-2 px-4 py-2 text-sm font-semibold text-white"
            >
              {generatingExperience ? "Generating..." : "Generate"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
export default CreateCV;
