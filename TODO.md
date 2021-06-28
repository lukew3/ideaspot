* Category tag(s) so that builders can find things that they can/want to build
* Improve profile page
  * Add edit settings page
* Add status options for ideas
  * A user can select "interested", "planning on building", or "building now"
    * Maybe have a status for ideas that you want to keep in the database but no don't have an interest in it anymore.
      * Could call it "Bad Idea" or "No longer interested"
  * "I am":
    * "Interested"
    * "Planning on building"
    * "Building now"
* Make home page look different if it's your first time on the site
  * Show an about message box or something
* Don't show profile of a user if that user doesn't exist

Possible Ideas:
* If you say that you are planning on building or currently building an app, ask the builder if they would like to thank the creator by sending them a tip
  * There could be a non-popup tip if you aren't planning or currently building the idea
* Add ability to enable link sharing of an idea
* Add ability to change your username
  * Would have to change all references to that user
    * Just owner labels right now, but as features increase, this could become difficult
* Pagination on home, myideas page
  * Could have infinite scroll like reddit as well
* Compressed view of ideas
  * Could show just a single line of text, like gmail with the title in bold on the left and the first line or so of the description
  * Could have a small, colored bar(5px?) on the left(?) side of the bar that when hovered over, will expand or pop upward to show the tag that is signified by the bar
  * Search for one of your ideas
  * Could later add search for all public ideas on the database
    * Would be slow since I can't afford to load everything into ram and process requests like that
      * Could just store titles in search database
* Should be some sort of measure of achievement on your profile to show that you are dedicated to this platform
  * Reddit shows karma, instagram has followers.
    * I kind of like "Rep" or "Reportoire" for long
  * Maybe show number of ideas written, amount of interests, plan to builds, and builds
* If you are on the viewidea or edit idea page, the title of the page should be <the title of the idea> - Build My Idea
* Add ability to subscribe to users?
* Add undo for delete button
  * Could also have a trash section for ideas that you deleted but didn't want to actually get rid of
    * Saved for 30 days or something but could be deleted manually
* Remove link from text, links in markdown are unclickable
* RSS feed for new Ideas
* Could remove comments list when comments are not visible(home or get ideas page), or request comments as a seperate api request
* Below the like buttons there should be a pair of numbers,
  * One should be the likes/dislikes
  * Next should be the boost number
    * Should be a boost button as well

## Team building
* Users may want to build an idea themselves, but want a team that they can work with to build it
* Idea should be able to have a public description and then a private description that can be revealed once the person has joined their team
* Should have location tags or tags for positions needed

### Possible Tags
* Looking for a team
* For sale
* Private
* custom tags
* Should be tags for how big the project is
  * Small(build in a day or less)
  * Medium(could squeeze into a long weekend to a week)
  * Large(long time to build, probably need a team)
