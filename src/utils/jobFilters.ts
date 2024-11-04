interface JobFilterConfig {
  excludeKeywords: string[];
  requireKeywords: string[];
  minSalary?: number;
}

export function isJobRelevant(
  title: string,
  description: string,
  company: string,
  filterConfig: JobFilterConfig,
): boolean {
  const textToSearch = `${title} ${description} ${company}`.toLowerCase();

  const hasExcludedKeyword = filterConfig.excludeKeywords.some((keyword) =>
    textToSearch.includes(keyword.toLowerCase()),
  );
  if (hasExcludedKeyword) {
    return false;
  }

  const hasAllRequiredKeywords = filterConfig.requireKeywords.every((keyword) =>
    textToSearch.includes(keyword.toLowerCase()),
  );
  if (!hasAllRequiredKeywords) {
    return false;
  }

  return true;
}
