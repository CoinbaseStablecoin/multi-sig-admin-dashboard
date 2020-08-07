type HTMLInputElements =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;

export function handleStringChange<
  T extends { value: string } = HTMLInputElements
>(setter: (value: string) => void) {
  return (evt: React.ChangeEvent<T>) => {
    setter(evt.target.value);
  };
}

