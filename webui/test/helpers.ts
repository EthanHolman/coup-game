export function getAttributeValue(element: HTMLElement, attributeName: string) {
  return element.attributes.getNamedItem(attributeName)?.value ?? undefined;
}

export function isAriaSelected(element: HTMLElement): boolean {
  const x = getAttributeValue(element, "aria-selected");
  return x === "true";
}

export function doesElementHaveClassname(
  element: HTMLElement,
  classname: string
): boolean {
  let foundClassname = false;
  element.classList.forEach((x) => {
    if (x.startsWith(classname)) foundClassname = true;
  });
  return foundClassname;
}
