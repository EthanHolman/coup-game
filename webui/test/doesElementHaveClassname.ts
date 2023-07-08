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
