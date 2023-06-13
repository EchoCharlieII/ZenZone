# ZenZone

## Rules of branches:
- Main branch: Always be available for release.
- Develop branch: The latest development version is merged to the master branch when the code in that branch is stable and ready for release.
- Temporary branches:
  1. Feature branch: Feature module branch, create one when developing new features to feature-xxx, after development is complete, **merge to develop and delete it**.
  2. Pre-release branch: When a new verson is about to released, create a pre-release branch from the develop branch, test for problems and then prepare it for release, tag master branch with verson number, **merge to develop and main branch and delete it**.
  3. Hotfix branch: Emergency bug fix branch, named hotfix-xxx, after the modification is complete, **merge to master and develop branch, delete it after merging**.
