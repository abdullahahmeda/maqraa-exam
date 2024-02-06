export function arabicNumeralsToEnglish(str: string) {
  return str.replace(/[٠-٩]/g, (d) => '' + '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
}
