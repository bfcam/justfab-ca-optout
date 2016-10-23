# justfab-ca-optout
Automatically opts out of JustFab Canada's monthly billing for VIP members

* Provides screenshots of site state on error.

## Install

* Get modules with npm `npm update`
* Update `optout.js` with your username and password
* Add `optout` shell script to cron to run once between the 1st and 5th of every month

## Cron

* Use a cron rule similar to (This runs on the 2nd of every month): `0 0 2 * * /path/to/optout`
* Ensure that cron error messages get emailed to you as the optout procedure could fail. If the procedure fails you will me notified and provided with a screenshot of the site state.
