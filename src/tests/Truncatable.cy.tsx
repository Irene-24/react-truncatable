import React from "react";

import { composeStories } from "@storybook/react";

import * as Stories from "../stories/Truncatable.stories";
import { mount } from "cypress/react18";

const {
  Basic,
  AsALink,
  WithCustomTogglerButton,
  LimitCharacterCount,
  WithCustomClassNameAndStyle,
  RemoveMoreCharacters,
} = composeStories(Stories);

describe("Truncatable component", () => {
  it("should render correctly", () => {
    mount(<Basic />);

    cy.get("p").contains("...");
  });

  it("should render allow content to hide/show", () => {
    mount(<WithCustomTogglerButton />);

    cy.get("button").contains("Show all").click();

    cy.get("button").contains("Hide").click();
  });

  it("should trim off some charcaters", () => {
    mount(
      <>
        <RemoveMoreCharacters />
        <Basic />
      </>
    );

    //give it some time to calculate stuff
    cy.wait(1000);

    cy.get("p:first-child")
      .should("exist")
      .then((firstP) => {
        cy.get("p:nth-child(2)")
          .should("exist")
          .then((secondP) => {
            const firstText = firstP.text().trim();
            const secondText = secondP.text().trim();

            expect(firstText.length).to.be.lessThan(secondText.length);
          });
      });
  });

  it("should render a clickable link", () => {
    mount(<AsALink />);

    cy.get("a").should("have.attr", "href").and("include", "wikipedia");
  });

  it("should render a maximum of 10 characters including '...' ", () => {
    mount(<LimitCharacterCount />);

    cy.get("p")
      .should("exist")
      .invoke("text")
      .then((textContent) => {
        expect(textContent.length).to.be.at.most(10);
      });
  });

  it("should render a p tag with a certain className/style", () => {
    mount(<WithCustomClassNameAndStyle />);

    cy.get("p")
      .should("exist")
      .then((component) => {
        expect(component).to.have.class("w-1/3");

        expect(component).to.have.css("color", "rgb(0, 0, 0)");
      });
  });
});
