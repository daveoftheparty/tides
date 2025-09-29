import { Component, h, Element } from "@stencil/core";

@Component({
	tag: 'ds-user-guide',
	shadow: true
})
export class UserGuide {

	@Element() hostElement: HTMLElement;

	render() {
		return (
			<div>
				User Guide Component

				<p><button onClick={() => this.hostElement.dispatchEvent(new CustomEvent('backToTide', {bubbles: true }))}>Back to Tide Chart</button></p>

			</div>
		);
	}
}
