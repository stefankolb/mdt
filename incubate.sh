#!/bin/bash

# ==============================================================================
# Incubator init script
#
# (c) 2015 Stefan Kolb <dev@stefankolb.de>
# ==============================================================================

# Get the current time to calculate the time needed to execute this script
TIME_START=$(date +%s)

# Clear the console
clear

printf "\n"
echo "   ____ _  __ _____ __  __ ___   ___  ______ ____   ___  "
echo "  /  _// |/ // ___// / / // _ ) / _ |/_  __// __ \ / _ \ "
echo " _/ / /    // /__ / /_/ // _  |/ __ | / /  / /_/ // , _/ "
echo "/___//_/|_/ \___/ \____//____//_/ |_|/_/   \____//_/|_|  "
printf "\n"

# Set defaults
NOTAVAILABLE="-"
TAG_ERROR="$(tput setaf 1)[ERROR]$(tput sgr 0)"
DIR_TEMP="/tmp/incubator_temp"
LINE_BREAK="$(echo -e '\n\b')"

# Determine destination directory for new project
while true; do
	read -ep "Please enter directory to create new project in ${LINE_BREAK}$ " dir
	DIR_DEST=`eval echo ${dir//>}`
	
	# Check if the directory already exists and whether or not it is okay to
	# override/delete it
	if [ -d "${DIR_DEST}" ]; then
		read -ep "The directory \"${dir}\" already exists!${LINE_BREAK}Are you sure you want to override it (ALL CURRENT CONTENT OF THIS DIRECTORY WILL BE DELETED!)${LINE_BREAK}(yes|no) $ " yn
		case $yn in
        [Yy]* ) rm -rf ${DIR_DEST}; break;;
        [Nn]* ) exit 1;;
        * ) echo "Please answer yes or no.";;
    esac
	else
		break;
	fi
done

# Determine new project's name
while true; do
	read -ep "Please enter project name ${LINE_BREAK}$ " PROJECT_NAME
	if [ ! -z "${PROJECT_NAME}" ]; then
		break;
	fi
done

# Clone git repository
git clone https://github.com/stefankolb/incubator.git ${DIR_TEMP}

# Prepare Incubator
rm -rf ${DIR_TEMP}/.git	# Remove git info from incubator
find -E ${DIR_TEMP} -regex '.*\.(js|json|scss|html)' -exec sed -i '' -e "s/{APPLICATION_NAME}/$PROJECT_NAME/"  {} + #Replace {APPLICATION_NAME} placeholder with project name

# Move incubator repo to destination directory and perform initial commit
mv ${DIR_TEMP} ${DIR_DEST}
cd ${DIR_DEST}
git init
git add * .gitignore *.jshintrc
git commit -m "Initial commit"

# Install local node and bower modules
printf "\nInstalling node and bower modules/dependencies\n"
npm install
bower install

# Create Git tag for version numbering
git tag v0.0.0

# Clean-up
rm -rf ${DIR_TEMP};

# All done
TIME_END=$(date +%s)
printf "\nProject incubated successfully in $((${TIME_END} - ${TIME_START})) second(s)\n\n"
