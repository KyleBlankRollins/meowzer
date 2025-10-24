We added a main navigation bar to the top of the docs site. This bar adds all landing pages for each subdirectory in `docs/source/content`. With this top-level selection happening there, we need to modify what the sidebar navigation shows.

We need to dynamically change the sidebar nav items based on what's selected in the top nav bar. The side bar should only show children of the selected subdirectory (and not the landing page for the subdirectory).

For example, when "API Reference" is selected, the sidebar navigation should only show the child pages in `docs/source/content/api`.
