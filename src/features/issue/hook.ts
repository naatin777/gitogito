import { useRenderer } from "@opentui/react";
import { useCallback, useEffect } from "react";
import type z from "zod";
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts";
import type { IssueSchema } from "../../schema.ts";
import type { Issue, IssueTemplate } from "../../type.ts";
import {
  createIssue,
  editIssue,
  loadTemplates,
  selectIssue,
  selectTemplate,
  setError,
  setGeneratedIssues,
  submitOverview,
} from "./issue_slice.ts";

export function useIssueFlow() {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.issue);
  const renderer = useRenderer();

  useEffect(() => {
    if (state.step === "done" || state.step === "error") {
      renderer.destroy();
    }
  }, [state.step, renderer]);

  const loadTemplatesHandler = useCallback(async () => {
    await dispatch(loadTemplates());
  }, [dispatch]);

  const selectTemplateHandler = useCallback((template: IssueTemplate | undefined) => {
    if (template) {
      dispatch(selectTemplate(template));
      return;
    }

    dispatch(setError("Issue template selection was cancelled."));
  }, [dispatch]);

  const submitOverviewHandler = useCallback((overview: string) => {
    dispatch(submitOverview(overview));
  }, [dispatch]);

  const handleAgentDone = useCallback((result: z.infer<typeof IssueSchema>) => {
    if (result && result.issue.length > 0) {
      dispatch(setGeneratedIssues(result));
      return;
    }

    dispatch(setError("No issue candidates were generated."));
  }, [dispatch]);

  const selectIssueHandler = useCallback((issue: Issue | undefined) => {
    if (issue) {
      dispatch(selectIssue(issue));
      return;
    }

    dispatch(setError("Issue selection was cancelled."));
  }, [dispatch]);

  const editIssueHandler = useCallback(async () => {
    if (state.step === "edit_issue") {
      await dispatch(editIssue(state.selectedIssue));
    }
  }, [dispatch, state]);

  const createIssueHandler = useCallback(async () => {
    if (state.step === "creating") {
      await dispatch(createIssue(state.finalIssue));
    }
  }, [dispatch, state]);

  return {
    state,
    loadTemplates: loadTemplatesHandler,
    selectTemplate: selectTemplateHandler,
    submitOverview: submitOverviewHandler,
    handleAgentDone,
    selectIssue: selectIssueHandler,
    editIssue: editIssueHandler,
    createIssue: createIssueHandler,
  };
}
