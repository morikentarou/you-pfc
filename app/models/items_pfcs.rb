class ItemsPfcs < ApplicationRecord
  extend ActiveHash::Associations::ActiveRecordExtensions
  belongs_to :store
  belongs_to :item
  belongs_to :pfc
end
