From face value, the Dymocks website does quite well with accessibility. From initial inspection, the page does well
to accomodate various sizes of the web browser with responsive scaling for mobile. At all sizes of the website, visual
elements remain readable and consistent with good scaling and spacing.
In mobile view, touch elements like hamburger menus and cart icons are sized to a large size, keeping them easy to click.

The desktop site also remains readable and maintains formatting when zoomed in. This allows for users with site impairement 
to access the site and read text at a larger size.

Looking at other elements of the side from a visual overview, there are some issues with the information architecture,
as well in accomodating for autism. The overall information architecture, particularly in the menu which is cluttered and
confusing. This structure does little to assist users with autism due to the large chunks of text. There are also issues in
this same space with moving images and cluttered text throughout the site in book blurbs and other sections of information.
On the plus side, navigation is relatively consistent throughout the site and follows many common web standards.

From closer look at the source code, comes the first prominent issue. Throughout the site there are various images in the
form of section cards, rotating card banners as well as book covers. All the images on this site are rendered through
CSS styling in divs. These elements have no alt tags or any other values that could be interpreted by screen readers or
other assistive technologies.

Looking at Google Lighthouse, Dymocks achieves a score of 74 for accessibility. Of the subset of accessibility opportunities tested, Dymocks does well. The issues highlighted are very similar to the issues we've already examined,
with little concessions for screen readers. This includes a lack of discernible names on links, as well as some issues with
ARIA usage with attributes

In remedying these issues, we can make some very simple changes to improve acccessibility for assistive technologies like screen readers. This would involve adding values or alt tags to images and other pieces of visual information. We could also add more discernible names to links to improve navigation for screen reader users.

We could also improve accessibility for groups with disabilities by restructuring large chunks of text into more manageable 
sections, as well as reworking the categorisation of the menu. With the current structure of information, there is an 
overwhelming amount of options to sift through to find book categories. These categories are also ordered in a way that is 
difficult to follow. In this instance we could benefit from more sub-menus to limit the amount of information being 
exposed to the user at any given time. We could also work to order menu categories alphabetically, making it easier to 
find things.