#!/bin/bash

# Generate placeholder images for plankton survey
# Creates 512x512 images with category and subcategory labels

echo "Generating placeholder images..."

# Function to create a placeholder image
create_placeholder() {
    local filepath=$1
    local category=$2
    local subcategory=$3
    local image_num=$4

    convert -size 512x512 xc:"hsl($((RANDOM % 360)),50%,70%)" \
        -gravity center \
        -pointsize 48 \
        -fill white \
        -annotate +0-50 "Category ${category}" \
        -pointsize 36 \
        -annotate +0+0 "${subcategory}" \
        -pointsize 24 \
        -annotate +0+50 "Image ${image_num}" \
        "${filepath}"
}

# Generate images for each category and subcategory
for category in 001 002 003; do
    for subcat in A B; do
        for i in 1 2 3; do
            filename="placeholder_${category}_${subcat}_${i}.jpg"
            filepath="public/images/${category}/subcategory_${subcat}/${filename}"
            echo "Creating ${filepath}"
            create_placeholder "${filepath}" "${category}" "${subcat}" "${i}"
        done
    done
done

echo "Placeholder images generated successfully!"
