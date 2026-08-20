import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { Empty, PrimaryButton } from "../components/ui";
describe("shared mobile UI",()=>{
  it("renders empty states",async()=>{const view=await render(<Empty title="Nothing saved yet" body="Tap a heart to keep an offer."/>);expect(view.getByText("Nothing saved yet")).toBeTruthy();expect(view.getByText("Tap a heart to keep an offer.")).toBeTruthy()});
  it("handles primary actions",async()=>{const press=jest.fn();const view=await render(<PrimaryButton testID="action" label="Continue" onPress={press}/>);await fireEvent.press(view.getByTestId("action"));expect(press).toHaveBeenCalledTimes(1);await view.rerender(<PrimaryButton testID="action" label="Continue" disabled onPress={press}/>);await fireEvent.press(view.getByTestId("action"));expect(press).toHaveBeenCalledTimes(1)});
});
