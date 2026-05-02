import asyncHandler from "../../utils/Error/asyncHandler.js";

import { ApiResponse } from "../../utils/Error/ApiResponse.js";

import { postmortemService } from "./postmortem.service.js";

export const createPostmortem = asyncHandler(async (req, res) => {
  const { incidentId } = req.params;

  const postmortem = await postmortemService.createPostmortem({
    incidentId,
    ...req.body,
  });

  return res.status(201).json(new ApiResponse(201, postmortem, "Postmortem created successfully"));
});

export const getPostmortem = asyncHandler(async (req, res) => {
  const { incidentId } = req.params;

  const postmortem = await postmortemService.getPostmortem({
    incidentId,
  });

  return res.status(200).json(new ApiResponse(200, postmortem, "Postmortem fetched successfully"));
});

export const updatePostmortem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const postmortem = await postmortemService.updatePostmortem({
    id,
    data: req.body,
  });

  return res.status(200).json(new ApiResponse(200, postmortem, "Postmortem updated successfully"));
});

export const deletePostmortem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await postmortemService.deletePostmortem({
    id,
  });

  return res.status(200).json(new ApiResponse(200, {}, "Postmortem deleted successfully"));
});
