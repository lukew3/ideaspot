* Update nav on login
* Allow users to stay signed in for longer
  * I think I need to use a refresh token
* Category tag(s) so that builders can find things that they can/want to build
* Add delete idea
* Fix checkboxes not selected on edit page
* Remove link decoration on itembox
  * Blue underline
* Add status options for ideas
  * A user can select "interested", "planning on building", or "building now"
    * Maybe have a status for ideas that you want to keep in the database but no don't have an interest in it anymore.
      * Could call it "Bad Idea" or "No longer interested"
* Lost password handling
* Make home page look different if it's your first time on the site
  * Show an about message box or something

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
