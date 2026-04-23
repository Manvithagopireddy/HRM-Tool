import { useEffect } from 'react';

/**
 * Sets the browser tab title dynamically.
 * Falls back to the base app name if no page title is provided.
 * @param {string} pageTitle - The current page name (e.g. "Employees")
 */
const useDocumentTitle = (pageTitle) => {
  useEffect(() => {
    const prev = document.title;
    document.title = pageTitle ? `${pageTitle} — PeopleCore` : 'PeopleCore — Enterprise Suite';
    return () => { document.title = prev; };
  }, [pageTitle]);
};

export default useDocumentTitle;
