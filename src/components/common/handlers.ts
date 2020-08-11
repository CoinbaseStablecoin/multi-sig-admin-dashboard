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

export function handleIntegerChange<
  T extends { value: string } = HTMLInputElements
>(setter: (value: number) => void) {
  return (evt: React.ChangeEvent<T>) => {
    setter(Math.floor(Number(evt.target.value)));
  };
}
