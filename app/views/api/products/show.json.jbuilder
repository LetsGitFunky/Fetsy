json.product do
  json.extract! @product, :id, :name, :description, :price, :category, :img_urls
end

# TODO image_urls
